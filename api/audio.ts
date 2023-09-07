import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export namespace Authorized {
  export async function getAudio(showName: string, audioName: string) {
    const path = `${showName}/${audioName}`;
    const { data, error } = await supabase.storage.from("Audio").download(path);
    if (error) throw error;
    return data;
  }
  export function useGetAudioQuery(showName: string, audioName: string) {
    return useQuery(["audio", showName, audioName], () =>
      getAudio(showName, audioName)
    );
  }
}

export namespace Public {
  export async function getAudio(
    showName: string,
    audioName: string,
    ticketKey: string
  ) {
    const body = {};

    const { data, error } = await supabase.functions.invoke("get_audio", {
      body: {
        showName,
        audioName,
        ticketKey,
      },
    });

    if (error) throw error;
    return data;
  }
  export function useGetAudioQuery(
    showName: string,
    audioName: string,
    ticketKey: string
  ) {
    return useQuery(["audio", showName, audioName], () =>
      getAudio(showName, audioName, ticketKey)
    );
  }
}
