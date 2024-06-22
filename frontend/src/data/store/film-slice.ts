import { StateCreator } from "zustand";
import { Film } from "~/schema/Film";

type FilmState = {
  films: Map<Film["filmId"], Film>;
};

type FilmAction = {};

export type FilmSlice = FilmState & FilmAction;

export const createFilmSlice: StateCreator<
  FilmSlice,
  [["zustand/devtools", never]],
  [],
  FilmSlice
> = (set) => ({ films: new Map() });
