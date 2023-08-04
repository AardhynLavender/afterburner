import { Audio, AVPlaybackSource } from "expo-av";
import { useState, useEffect } from "react";

export async function loadSound(file: AVPlaybackSource) {
  return await Audio.Sound.createAsync(file);
}

export async function unloadSound(sound: Audio.Sound) {
  const status = await sound.unloadAsync();
  return status;
}

export default function useSound(file: AVPlaybackSource) {
  const [sound, setSound] = useState<Audio.Sound | null>();
  const [error, setError] = useState<Error | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  // load sound on mount (and path change)
  useEffect(() => {
    async function load() {
      try {
        setPlaying(false);
        setLoaded(false);
        if (sound) await unloadSound(sound); // unload previous sound
        const { sound: newSound, status } = await loadSound(file); // load new sound
        setSound(newSound);
        setLoaded(status.isLoaded);
        setError(null);
      } catch (error) {
        if (error instanceof Error) setError(error);
        else setError(new Error("Unknown error"));
      }
    }

    load();
  }, [file]);

  // unload sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          unloadSound(sound);
        }
      : undefined;
  }, [sound]);

  const play = async () => {
    try {
      await sound?.playAsync();
      setPlaying(true);
    } catch (error) {
      if (error instanceof Error) setError(error);
      else setError(new Error("Unknown error"));
    }
  };
  const stop = async () => {
    try {
      await sound?.stopAsync();
      setPlaying(false);
    } catch (error) {
      if (error instanceof Error) setError(error);
      else setError(new Error("Unknown error"));
    }
  };
  const pause = async () => {
    try {
      await sound?.pauseAsync();
      setPlaying(false);
    } catch (error) {
      if (error instanceof Error) setError(error);
      else setError(new Error("Unknown error"));
    }
  };

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
     * Stores any caught errors
     * @default null
     */
    error,
  };
}
