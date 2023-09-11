import { invariant } from "../exception/invariant";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export async function authenticate(email: string, password: string) {
  try {
    invariant(EMAIL_REGEX.test(email), "Email is invalid");
    invariant(password.length, "Password is required");

    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
