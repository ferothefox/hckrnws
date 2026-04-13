import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TBaseStory } from "@/types/story";

type StarredStoriesState = {
  hasHydrated: boolean;
  starredStories: TBaseStory[];
};

type StarredStoriesActions = {
  setHasHydrated: (hasHydrated: boolean) => void;
  toggleStarredStory: (story: TBaseStory) => void;
};

type StarredStoriesStore = StarredStoriesState & StarredStoriesActions;

const initialState: StarredStoriesState = {
  hasHydrated: false,
  starredStories: [],
};

const useStore = create<StarredStoriesStore>()(
  persist(
    (set) => ({
      ...initialState,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      toggleStarredStory: (story) =>
        set((state) => {
          const isStoryStarred = state.starredStories.some(
            (starredStory) => starredStory.id === story.id,
          );

          return {
            starredStories: isStoryStarred
              ? state.starredStories.filter(
                  (starredStory) => starredStory.id !== story.id,
                )
              : [...state.starredStories, story],
          };
        }),
    }),
    {
      name: "hckrnws-starred-stories",
      partialize: ({ starredStories }) => ({ starredStories }),
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useStore;
