import { collection, doc, query, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { Chapter, Identity, ActiveShow } from "./types";
import UnhandledError from "../exception/unhandled";
import { useEffect, useState } from "react";
import { usePersistent } from "./persistent";
import { useActiveTicket } from "./ticket";
import { getShowData } from "./functions";

export function useChapterCreateMutation() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const addChapter = async (showId: string, chapter: Chapter & Identity) => {
    try {
      setLoading(true);
      await setDoc(
        doc(firestore, "show", showId, "chapter", chapter.id),
        chapter
      );
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error : new UnhandledError("Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    addChapter,
  };
}

export function useChapterListQuery(showId: string) {
  const [error, setError] = useState<Error | null>(null);
  const [chapters, setChapters] = useState<(Chapter & Identity)[]>([]);
  const [loading, setLoading] = useState(true);

  const handleError = (error: Error) => {
    console.error(error);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, "show", showId, "chapter"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Identity & Chapter)
        );
        setChapters(data);
        setLoading(false);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return {
    error,
    chapters,
    loading,
  };
}
