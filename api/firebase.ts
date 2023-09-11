import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableOptions,
} from "firebase/functions";

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

const storage = getStorage(firebase);
export async function getFileUrl(path: string) {
  const url = await getDownloadURL(ref(storage, path));
  return url;
}

export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);
