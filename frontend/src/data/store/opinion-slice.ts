import { StateCreator } from "zustand";
import { Opinion } from "~/schema/Opinion";

type OpinionState = {
  opinions: Map<Opinion["opinionId"], Opinion>;
};

type OpinionAction = {};

export type OpinionSlice = OpinionState & OpinionAction;

export const createOpinionSlice: StateCreator<
  OpinionSlice,
  [],
  [],
  OpinionSlice
> = (set) => ({ opinions: new Map() });
