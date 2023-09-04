import AsyncStorage from "@react-native-async-storage/async-storage";
import { invariant } from "../exception/invariant";
import { useState, useEffect, useCallback, useRef } from "react";
import { getNativeSourceAndFullInitialStatusForLoadAsync } from "expo-av/build/AV";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./client";

function invalidateStoreQuery() {
  queryClient.invalidateQueries(["asyncStorage"]);
}
export async function dumpPersistentStore() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    const store = Object.fromEntries(items);

    return store;
  } catch (error) {
    console.error(error);
  }
}
export function usePersistentDumpQuery() {
  return useQuery(["persistentDump"], dumpPersistentStore);
}

export type Primitive = string | number | object | boolean | null;
export const PrimitiveTypes = [
  "string",
  "number",
  "object",
  "boolean",
] as const;
export type PrimitiveType = (typeof PrimitiveTypes)[number];

class WriteException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "WriteException";
  }
}

function serialize<T extends Primitive>(value: T) {
  if (typeof value === "string") return value;
  return typeof value === "object" ? JSON.stringify(value) : value.toString();
}

function deserialize(value: string | null) {
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(parseInt(value))) return parseInt(value);
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    return value;
  }
}

export async function write<T extends Primitive>(key: string, value: T) {
  try {
    const writable = serialize(value);
    await AsyncStorage.setItem(key, writable);
    invalidateStoreQuery();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
  }
}

export async function read<T extends Primitive>(key: string) {
  try {
    const readable = await AsyncStorage.getItem(key);
    const writable = deserialize(readable);
    return writable as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
    throw error;
  }
}

export async function remove(key: string) {
  try {
    await AsyncStorage.removeItem(key);
    invalidateStoreQuery();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
    throw error;
  }
}

export async function clear() {
  try {
    await AsyncStorage.clear();
    invalidateStoreQuery();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
    throw error;
  }
}

export function usePersistent<T extends Primitive>(
  key: string,
  initialValue: T | null = null
) {
  const [reading, setReading] = useState(true);
  const [value, setValue] = useState<T | null>(null);

  // read from disk on mount
  useEffect(() => {
    (async () => {
      const value = await read<T>(key);
      setValue(value ?? initialValue);
      setReading(false);
    })();
  }, []);

  // write to disk when value changes
  useEffect(() => {
    (async () => {
      await write<T>(key, value as T);
    })();
  }, [value]);

  return [value, setValue, reading] as const;
}
