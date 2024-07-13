import { useMainStore } from "../contexts/store-context";
import { pick } from "~/utilities/pick";
import { useLoadData } from "./useLoadData";
import { getFilms } from "~/service/apiUtils";

export const useLoadFilmData = () => {
  const { setFilms, setFilmPredictions } = useMainStore((state) => ({
    ...pick(state, ["setFilms", "setFilmPredictions"]),
  }));

  return useLoadData("getFilms", getFilms, (films) => {
    setFilms(films);
    films.map((film) => setFilmPredictions(film.filmId, [film.topPrediction]));
  });
};
