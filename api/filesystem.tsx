class ReadBlobError extends Error {
  constructor(uri: string) {
    super(`Failed to generate blob for \`${uri}\``);
    this.name = "BlobError";
  }
}

export function readBlob(uri: string) {
  return new Promise<Blob | null>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.responseType = "blob";

    // bind promise to request events
    request.onload = () => resolve(request.response);
    request.onerror = () => reject(new ReadBlobError(uri));

    request.open("GET", uri, true);
    request.send(null);
  });
}
