import { create } from "zustand";

import createStarSlice, { StarSlice } from "./createStarSlice";

const useStore = create<StarSlice>()((set, get, api) => ({
  ...createStarSlice(set, get, api),
}));

export default useStore;
