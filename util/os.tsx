import React, { Children, ReactElement } from "react";
import { Platform } from "react-native";

type Children = ReactElement | ReactElement[] | null;
type PlatformType = typeof Platform.OS;
type PlatformProps = {
  ios?: boolean;
  android?: boolean;
  web?: boolean;
  windows?: boolean;
  macos?: boolean;
};

export function OS({
  children = null,
  fallback = null,
  ...platforms
}: {
  children?: Children;
  fallback?: Children;
} & PlatformProps) {
  if (platforms[Platform.OS]) return <>{children}</>;
  return <>{fallback}</>;
}

export function IsAndroid() {
  return Platform.OS === "android";
}
export function IsIOS() {
  return Platform.OS === "ios";
}
export function IsWeb() {
  return Platform.OS === "web";
}
export function IsWindows() {
  return Platform.OS === "windows";
}
export function IsMacOS() {
  return Platform.OS === "macos";
}

export function IsNative() {
  return Platform.OS !== "web";
}
export function IsDesktop() {
  return Platform.OS === "windows" || Platform.OS === "macos";
}
export function IsMobile() {
  return Platform.OS === "android" || Platform.OS === "ios";
}
