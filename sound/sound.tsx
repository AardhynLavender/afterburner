import {
  Audio,
  AVPlaybackSource,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
} from "expo-av";
import { useState, useEffect, useRef } from "react";

export const DOWNLOAD_FIRST = false; // download and play simultaneously

export async function loadSound(
  file: AVPlaybackSource,
  onStatusChange?: (status: AVPlaybackStatus) => void
) {
  return await Audio.Sound.createAsync(
    file,
    {},
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
  onLoad?: () => void;
  onFinish?: () => void;
  onTick?: (position: number) => void;
};
export const DEFAULT_AUTOPLAY = false;

export const START_MS = 0;
export const TENTH_SECOND_MS = 100;
export const QUARTER_SECOND_MS = 250;
export const HALF_SECOND_MS = 500;
export const THREE_QUARTER_SECOND_MS = 750;
export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;

function isStatusSuccess(
  value: AVPlaybackStatus
): value is AVPlaybackStatusSuccess {
  return value.isLoaded;
}

export default function useSound(
  file: AVPlaybackSource,
  {
    autoPlay = DEFAULT_AUTOPLAY,
    tick = TENTH_SECOND_MS,
    onLoad,
    onFinish,
    onTick,
  }: Options = {}
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
      setPlaying(false);
      setLoaded(false);
      if (sound) await unloadSound(sound); // unload previous sound

      const { sound: newSound, status } = await loadSound(
        file,
        handleStatusChange
      ); // load new sound

      if (!isStatusSuccess(status))
        throw new Error("Sound did not load successfully");

      setDuration(status?.durationMillis ?? START_MS);
      setSound(newSound);
      setError(null);
      setLoaded(true);
      onLoad?.(); // user defined callback
    }, "Unknown error ocurred while loading sound")();
  }, [file]);

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
    if (!status) throw new Error("Sound is not loaded");
    await setStatus({ ...status, positionMillis: status.positionMillis + by });
  }, "Unknown error ocurred while seeking sound");

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
     * Get the duration of the sound
     */
    duration,
  } as const;
}
