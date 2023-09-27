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
