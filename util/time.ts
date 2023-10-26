// Constants //

export const SECOND_MS = 1000;
export const TENTH_SECOND_MS = 100;
export const QUARTER_SECOND_MS = 250;
export const HALF_SECOND_MS = 500;
export const THREE_QUARTER_SECOND_MS = 750;

export const MINUTE_S = 60;
export const MINUTE_MS = MINUTE_S * SECOND_MS;

export const HOUR_M = 60;
export const HOUR_S = HOUR_M * MINUTE_S;
export const HOUR_MS = MINUTE_S * MINUTE_MS;

export const MAX_HOUR_MINUTES = 59;
export const MAX_MINUTE_SECONDS = 59;
export const MAX_DAY_HOURS = 23;

// Units //

export function msToHours(ms: number) {
  return ms / HOUR_MS;
}
export function msToMinutes(ms: number) {
  return ms / MINUTE_MS;
}
export function msToSeconds(ms: number) {
  return ms / SECOND_MS;
}
export function hoursToMs(hours: number) {
  return hours * HOUR_MS;
}
export function minutesToMs(minutes: number) {
  return minutes * MINUTE_MS;
}
export function secondsToMs(seconds: number) {
  return seconds * SECOND_MS;
}

// Structures //

export function destructuredTimeToMs(
  hours: number,
  minutes: number,
  seconds: number
) {
  return hoursToMs(hours) + secondsToMs(seconds) + minutesToMs(minutes);
}

export function msToDestructuredTime(ms: number) {
  const hours = Math.floor(ms / HOUR_MS);
  const minutes = Math.floor(ms / MINUTE_MS);
  const seconds = Math.floor((ms % MINUTE_MS) / SECOND_MS);
  return [
    hours,
    minutes === HOUR_M ? 0 : minutes,
    seconds === MINUTE_S ? 0 : seconds,
  ] as const;
}

// Timestamps //

export function timestampToMs(timestamp: string, delimiter = ":") {
  const [hours, minutes, seconds] = timestamp.split(delimiter).map(Number);
  return destructuredTimeToMs(hours, minutes, seconds);
}

export function msToTimestamp(ms: number) {
  const units = msToDestructuredTime(ms);
  return units.map((u) => u.toString().padStart(2, "0")).join(":");
}
