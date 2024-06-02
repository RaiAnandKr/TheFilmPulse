"use client";

import { FilmPredictionsCard } from "~/components/film-predictions-card";
import { FILMS } from "~/constants/mocks";

const PredictionPage = () =>
  FILMS.map((film) => <FilmPredictionsCard key={film.filmId} film={film} />);

export default PredictionPage;
