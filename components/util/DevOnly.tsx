import React, { ReactElement } from "react";

const TRUE = "true";
export function isDev() {
  return process.env.EXPO_PUBLIC_IS_DEV === TRUE;
}

export default function DevOnly({
  children,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  fallback?: ReactElement | null;
}) {
  if (isDev()) return <>{children}</>;
  return fallback;
}
