import { collection, doc, query, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { Chapter, Identity } from "./types";
import UnhandledError from "../exception/unhandled";
import { useEffect, useState } from "react";

export function useChapterCreateMutation() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const addChapter = async (
    showId: string,
    chapter: Omit<Chapter, "audioFileUrl">
  ) => {
    try {
      setLoading(true);
      await setDoc(
        doc(firestore, "show", showId, "chapter", chapter.id.toString()),
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

export function useChapterGetQuery(showId: string, chapterId: number) {
  const [error, setError] = useState<Error | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error: Error) => {
    console.error(error);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const q = doc(firestore, "show", showId, "chapter", chapterId.toString());
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.data() as Chapter;
        setChapter(data);
        setLoading(false);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return {
    error,
    chapter,
    loading,
  };
}

export function useChapterMutation() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const mutateChapter = async (
    showId: string,
    chapterId: number,
    chapter: Partial<Chapter>
  ) => {
    try {
      setLoading(true);
      await setDoc(
        doc(firestore, "show", showId, "chapter", chapterId.toString()),
        chapter,
        { merge: true }
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
    mutateChapter,
    loading,
  };
}
