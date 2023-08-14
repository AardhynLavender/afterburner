import AsyncStorage from "@react-native-async-storage/async-storage";

export type Primitive = string | number | object | boolean;
export type PrimitiveType = "string" | "number" | "object" | "boolean";

class WriteException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "WriteException";
  }
}
class ReadException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "WriteException";
  }
}

class DeserializeException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "DeserializeException";
  }
}

function serialize<T extends Primitive>(value: T) {
  if (typeof value === "string") return value;
  return typeof value === "object" ? JSON.stringify(value) : value.toString();
}
function deserialize(value: string, type: PrimitiveType) {
  switch (type) {
    case "object":
      const object = JSON.parse(value);
      if (typeof object === "object") return object as object;
      throw new DeserializeException(
        `failed to extract boolean type from '${value}'`
      );
    case "string":
      return value;
    case "boolean":
      if (value === "true") return true;
      if (value === "false") return false;
      throw new DeserializeException(
        `failed to extract boolean type from '${value}'`
      );
    case "number":
      const number = parseInt(value);
      if (isNaN(number))
        throw new DeserializeException(
          `Failed to extract number from ${value}, not a number!`
        );
      return number;
  }
}

export async function write<T extends Primitive>(key: string, value: T) {
  try {
    const writable = serialize(value);
    await AsyncStorage.setItem(key, writable);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
  }
}

export async function read<
  T extends PrimitiveType,
  R extends Primitive | null =
    | (T extends "string"
        ? string
        : T extends "object"
        ? object
        : T extends "number"
        ? number
        : string)
    | null
>(key: string, type: T) {
  try {
    const readable = await AsyncStorage.getItem(key);
    if (readable === null || readable === undefined) return readable;
    const writable = deserialize(readable, type);
    return writable as R;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) throw new WriteException(message);
  }
}
