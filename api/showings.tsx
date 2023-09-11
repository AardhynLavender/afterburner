import { collection, addDoc, query, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "./firebase";
import { Identity, Showing } from "./types";
import UnhandledError from "../exception/unhandled";
import { useEffect, useState } from "react";

export function useShowingCreateMutation() {
  const [error, setError] = useState<Error | null>(null);

  const createShowing = async (showing: Showing) => {
    try {
      const ref = await addDoc(collection(firestore, "showing"), showing);
      return ref.id;
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error : new UnhandledError("Unknown error")
      );
    }
  };

  return {
    error,
    createShowing,
  };
}

export function useShowingGetQuery(showId: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showing, setShowing] = useState<Showing & Identity>();

  const handleError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const q = doc(firestore, "showing", showId);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setIsLoading(false);
        setShowing(snapshot.data() as Showing & Identity);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return {
    error,
    isLoading,
    showing,
  };
}

export function useShowingListQuery() {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showings, setShowings] = useState<(Showing & Identity)[]>([]);

  const handleError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, "showing"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Identity & Showing)
        );
        setIsLoading(false);
        setShowings(data);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return {
    error,
    isLoading,
    showings,
  };
}
