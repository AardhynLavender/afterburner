import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  SupabaseClient,
  createClient,
} from "https://esm.sh/@supabase/supabase-js";

type AudioFileRequest = {
  showName: string;
  audioName: string;
  ticketKey: string;
};
function isAudioFileRequest(value: unknown): value is AudioFileRequest {
  return (
    !!value &&
    typeof value === "object" &&
    "showName" in value &&
    "audioName" in value &&
    "ticketKey" in value
  );
}

const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;
const SUCCESS = 200;

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
function createSupabaseClient() {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return supabase;
}

const SECOND_MS = 1000;
const URL_DOWNLOAD_EXPIRY_S = 300; // 5 minutes
async function generateSignedUrl(client: SupabaseClient, path: string) {
  const expires = new Date(Date.now() + URL_DOWNLOAD_EXPIRY_S * SECOND_MS); // approximate due to promise resolution
  const { data: url, error } = await client.storage
    .from("Audio")
    .createSignedUrl(path, URL_DOWNLOAD_EXPIRY_S);
  if (error) throw error;

  return { signedUrl: url.signedUrl, expires: expires.toISOString() };
}

serve(async (req: Request) => {
  try {
    const body = await req.json();
    if (!isAudioFileRequest(body))
      return new Response(
        JSON.stringify({ data: null, error: "Invalid Request" }),
        { status: BAD_REQUEST }
      );
    const { showName, audioName } = body;

    const client = createSupabaseClient();

    // todo: check `ticketKey` is valid

    const path = `${showName}/${audioName}`;
    const url = await generateSignedUrl(client, path);

    const res = {
      data: url,
      error: null,
    };
    return new Response(JSON.stringify(res), {
      status: SUCCESS,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ data: null, error: error.message }), {
      status: INTERNAL_SERVER_ERROR,
    });
  }
});
