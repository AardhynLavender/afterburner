import { useEffect, DependencyList } from "react";

export function useAsyncEffect(
  fn: () => Promise<void>,
  deps: DependencyList,
  onUnmount?: () => void
) {
  useEffect(() => {
    fn();
    return onUnmount;
  }, deps);
}
