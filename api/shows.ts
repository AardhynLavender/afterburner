import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { Identity, Show } from "./types";
import UnhandledError from "../exception/unhandled";
import { useEffect, useState } from "react";

export function useShowCreateMutation() {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addShow = async (show: Show) => {
    setIsLoading(true);
    try {
      const ref = await addDoc(collection(firestore, "show"), show);
      return ref.id;
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error : new UnhandledError("Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { error, addShow, isLoading };
}

export function useShowGetQuery(showId: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState<Show & Identity>();

  const handleError = (error: Error) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const q = doc(firestore, "show", showId);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setIsLoading(false);
        setShow({ ...snapshot.data(), id: showId } as Show & Identity);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return {
    error,
    isLoading,
    show,
  };
}

export function useShowMutation() {
  const [error, setError] = useState<Error | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const mutateShow = async (id: string, show: Partial<Show>) => {
    setIsMutating(true);
    try {
      await updateDoc(doc(firestore, "show", id), show);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error : new UnhandledError("Unknown error")
      );
    } finally {
      setIsMutating(false);
    }
  };

  return { error, mutateShow, isMutating };
}

export function useShowListQuery() {
  const [error, setError] = useState<Error | null>(null);
  const [shows, setShows] = useState<(Show & Identity)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, "show"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Identity & Show)
        );
        setIsLoading(false);
        setShows(data);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return { error, shows, isLoading };
}
