import type { StateCreator } from "zustand";
import type { Film } from "~/schema/Film";
import { mergeArrayToMap } from "~/utilities/mergeArrayToMap";

type FilmState = {
  films: Map<Film["filmId"], Film>;
};

type FilmAction = {
  setFilms: (films: Film[]) => void;
};

export type FilmSlice = FilmState & FilmAction;

export const createFilmSlice: StateCreator<
  FilmSlice,
  [["zustand/devtools", never]],
  [],
  FilmSlice
> = (set) => ({
  films: new Map(),
  setFilms: (films) =>
    set(
      (state) => ({
        films: mergeArrayToMap(state.films, films, "filmId"),
      }),
      false,
      "FilmAction/setFilms",
    ),
});
