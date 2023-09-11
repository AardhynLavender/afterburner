import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = "afterburner-ec084.appspot.com";
const EXPIRY = 24 * 60 * 60 * 1000; // expire after 24 hours ms

const storageClient = new Storage(); // Google Cloud Storage client

export async function generateSignedUrl(filepath: string) {
  const expires = Date.now() + EXPIRY;
  const options = { version: "v4", action: "read", expires } as const;

  // Get a v4 signed URL for reading the file
  const [url] = await storageClient
    .bucket(BUCKET_NAME)
    .file(filepath)
    .getSignedUrl(options);

  return url;
}
