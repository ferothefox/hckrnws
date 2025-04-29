import { StateCreator } from "zustand";
import { getLocalStorage, setLocalStorage } from "~/helpers/localstorage";
import { TBaseStory } from "~/types/story";

export interface StarSlice {
  starred: TBaseStory[] | [];
  starStory: (starred: TBaseStory[]) => void;
}

interface IStore extends StarSlice {}

const createStarSlice: StateCreator<IStore, [], [], StarSlice> = (
  set,
  get,
  api
): StarSlice => ({
  starred: getLocalStorage("starred", []),
  starStory: (starred) => {
    setLocalStorage("starred", starred);
    set({ starred });
  },
});

export default createStarSlice;
