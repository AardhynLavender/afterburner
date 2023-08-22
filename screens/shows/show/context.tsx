import React from "react";
import { createContext, useContext } from "react";
import { Chapter } from "../../../static";

type NextFn = () => void;

type ChapterContext = {
  chapter: Chapter | null;
  next: NextFn;
};

const ChapterContext = createContext<ChapterContext>({
  chapter: null,
  next: () => {},
});

export function useChapterContext() {
  return useContext(ChapterContext);
}

export function ChapterProvider({
  children,
  ...contextProps
}: {
  children: React.ReactNode;
  chapter: Chapter;
  next: NextFn;
}) {
  return (
    <ChapterContext.Provider value={contextProps}>
      {children}
    </ChapterContext.Provider>
  );
}
