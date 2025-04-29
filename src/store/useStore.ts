import { create } from "zustand";

import createStarSlice, { StarSlice } from "./createStarSlice";

interface IStore extends StarSlice {}

const useStore = create<IStore>()((set, get, api) => ({
  ...createStarSlice(set, get, api),
}));

export default useStore;
