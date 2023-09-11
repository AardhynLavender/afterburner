import React, { ReactElement } from "react";

const TRUE = "true";

export default function DevOnly({
  children,
  fallback = null,
}: {
  children: ReactElement | ReactElement[];
  fallback?: ReactElement | null;
}) {
  const isDev = process.env.EXPO_PUBLIC_IS_DEV === TRUE;
  if (isDev) return <>{children}</>;
  return fallback;
}
