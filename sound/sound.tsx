import {
  Audio,
  AVPlaybackSource,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
} from "expo-av";
import { useState, useEffect, useRef } from "react";
import { invariant } from "../exception/invariant";
import { TENTH_SECOND_MS } from "../util/time";

export const DOWNLOAD_FIRST = false; // download and play simultaneously

export async function loadSound(
  source: Source,
  onStatusChange?: (status: AVPlaybackStatus) => void,
  startPosition: number = START_MS
) {
  return await Audio.Sound.createAsync(
    typeof source === "string" ? { uri: source } : source,
    { positionMillis: startPosition },
    onStatusChange,
    DOWNLOAD_FIRST
  );
}
export async function unloadSound(sound: Audio.Sound) {
  const status = await sound.unloadAsync();
  return status;
}
export type Options = {
  tick?: number;
  autoPlay?: boolean;
  position?: number;
  onLoad?: () => void;
  onFinish?: () => void;
  onTick?: (position: number) => void;
};
export const DEFAULT_AUTOPLAY = false;
export const DEFAULT_ENABLED = true;

export const START_MS = 0;

function isStatusSuccess(
  value: AVPlaybackStatus
): value is AVPlaybackStatusSuccess {
  return value.isLoaded;
}

export type Source = AVPlaybackSource | string;

export default function useSound(
  source: Source,
  {
    autoPlay = DEFAULT_AUTOPLAY,
    tick = TENTH_SECOND_MS,
    onLoad,
    onFinish,
    onTick,
    position = START_MS,
  }: Options = {},
  enabled: boolean = DEFAULT_ENABLED
) {
  const [sound, setSound] = useState<Audio.Sound | null>();
  const [error, setError] = useState<Error | null>(null);
  const [duration, setDuration] = useState(0); // ms
  const [playing, setPlaying] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const handleError =
    <T,>(callback: (...args: any) => T, unhandledErrorMessage: string) =>
    (...args: any) => {
      try {
        return callback(...args);
      } catch (error) {
        console.error("error while processing ", callback);
        if (error instanceof Error) setError(error);
        else setError(new Error(unhandledErrorMessage));
      }
    };

  const handleStatusChange = (status: AVPlaybackStatus) => {
    if (!isStatusSuccess(status)) return;
    if (status.didJustFinish) onFinish?.();
  };

  // load sound on mount (and path change)
  useEffect(() => {
    handleError(async () => {
      if (!enabled) return;
      if (!source) return;

      setPlaying(false);
      setLoaded(false);
      if (sound) await unloadSound(sound); // unload previous sound

      invariant(position >= 0, "Position must be positive");

      const { sound: newSound, status } = await loadSound(
        source,
        handleStatusChange,
        position
      ); // load new sound

      invariant(isStatusSuccess(status), "Sound did not load successfully");
      invariant(
        position < (status?.durationMillis ?? START_MS),
        "Position must be less than duration"
      );

      setDuration(status?.durationMillis ?? START_MS);
      setSound(newSound);
      setError(null);
      setLoaded(true);
      onLoad?.(); // user defined callback
    }, "Unknown error ocurred while loading sound")();
  }, [source, enabled]);

  // unload sound on unmount
  useEffect(() => {
    if (!sound) return;
    if (autoPlay) play();
    return () => {
      unloadSound(sound);
    };
  }, [sound]);

  const getStatus = handleError(async () => {
    const status = await sound?.getStatusAsync();
    if (!status || !isStatusSuccess(status))
      throw new Error("Sound is not loaded");
    return status;
  }, "Unknown error ocurred while getting sound status");

  const setStatus = handleError(async (status: AVPlaybackStatus) => {
    await sound?.setStatusAsync(status);
  }, "Unknown error ocurred while setting sound status");

  const getPosition = handleError(async () => {
    const status = await getStatus();
    const position = status?.positionMillis;
    return !position || isNaN(position) ? START_MS : position;
  }, "Unknown error ocurred while getting sound position");

  const timeout = useRef<NodeJS.Timeout>();
  const clear = () => {
    timeout.current && clearInterval(timeout.current);
  };
  useEffect(() => {
    if (!playing) return clear(); // clear interval if not playing
    if (timeout.current) clear(); // clear previous interval
    timeout.current = setInterval(async () => {
      const position = await getPosition();
      onTick?.(position ?? START_MS); // call user defined callback
    }, tick);
    return clear;
  }, [playing, tick]);

  // public

  const play = handleError(async () => {
    await sound?.playAsync();
    setPlaying(true);
  }, "Unknown error ocurred while playing sound");

  const stop = handleError(async () => {
    await sound?.stopAsync();
    setPlaying(false);
  }, "Unknown error ocurred while stopping sound");

  const pause = handleError(async () => {
    await sound?.pauseAsync();
    setPlaying(false);
  }, "Unknown error ocurred while pausing sound");

  const seek = handleError(async (by: number) => {
    const status = await getStatus();
    invariant(status, "Sound is not loaded");
    await setStatus({ ...status, positionMillis: status.positionMillis + by });
  }, "Unknown error ocurred while seeking sound");

  const set = handleError(async (to: number) => {
    const status = await getStatus();
    invariant(status, "Sound is not loaded");
    await setStatus({ ...status, positionMillis: to });
  }, "Unknown error occurred while setting position");

  return {
    /**
     * Play the sound
     */
    play,
    /**
     * Stop the sound - resets to beginning
     */
    stop,
    /**
     * Pause the sound - can be resumed with `play()`
     */
    pause,
    /**
     * Whether the sound is currently playing
     */
    playing,
    /**
     * Whether the sound is loaded
     * @default false
     */
    isLoaded,
    /**
     * Store any caught errors
     * @default null
     */
    error,
    /**
     * Seek the sound by a given number of milliseconds
     */
    seek,
    /**
     * Set the position of the sound
     */
    set,
    /**
     * Get the duration of the sound
     */
    duration,
  } as const;
}
