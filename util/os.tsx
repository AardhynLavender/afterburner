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

function IsOS(os: PlatformType) {
  return () => Platform.OS === os;
}
export const IsAndroid = IsOS("android");
export const IsIOS = IsOS("ios");
export const IsWeb = IsOS("web");
export const IsWindows = IsOS("windows");
export const IsMacOS = IsOS("macos");

export function IsNative() {
  return Platform.OS !== "web";
}
export function IsDesktop() {
  return Platform.OS === "windows" || Platform.OS === "macos";
}
export function IsMobile() {
  return Platform.OS === "android" || Platform.OS === "ios";
}
