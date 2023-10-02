export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type Percent = `${number}%`;

export function percent(decimal: number): Percent {
  return `${decimal * 100}%`;
}
