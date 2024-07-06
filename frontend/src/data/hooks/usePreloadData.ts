import { useLoadFilmData } from "./useLoadFilmData";
import { useLoadUserData } from "./useLoadUserData";

export const usePreloadData = () => {
  useLoadUserData();
  useLoadFilmData();
};
