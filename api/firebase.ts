import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableOptions,
} from "firebase/functions";
import { readBlob } from "./filesystem";
import { invariant } from "../exception/invariant";

// Initialization //

const firebaseConfig = {
  apiKey: "AIzaSyCA2bbQ6wDdDSSrmnb2LF7MN8td1lJR95g",
  authDomain: "afterburner-ec084.firebaseapp.com",
  projectId: "afterburner-ec084",
  storageBucket: "afterburner-ec084.appspot.com",
  messagingSenderId: "398968599909",
  appId: "1:398968599909:web:70db832c4b86c2fe925d8c",
  measurementId: "G-60HFRPCBYL",
};

const firebase = initializeApp(firebaseConfig);

// Functions //

type CloudFunction = "claimTicket" | "getShowData";
type CloudFunctionParams = Record<string, any> | unknown;
type CloudFunctionResponse = Record<string, any> | unknown;
const functions = getFunctions(firebase);
export function fn<
  T extends CloudFunctionParams = unknown,
  R extends CloudFunctionResponse = unknown
>(functionName: CloudFunction, options: HttpsCallableOptions = {}) {
  return httpsCallable<T, R>(functions, functionName, options);
}

// Storage ///

const storage = getStorage(firebase);
export async function getFileUrl(path: string) {
  const url = await getDownloadURL(ref(storage, path));
  return url;
}
export async function uploadFile(src: string, dest: string) {
  console.log("Uploading file", src, dest);
  try {
    const blob = await readBlob(src);
    invariant(blob, "Failed to convert uri to blob");

    const fileRef = ref(storage, dest);
    const res = await uploadBytes(fileRef, blob);
    return res.metadata;
  } catch (error) {
    console.log(error);
    throw error || new Error("Failed to upload file");
  }
}

export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);
