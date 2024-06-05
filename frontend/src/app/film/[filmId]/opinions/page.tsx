"use client";

import { OpinionCard } from "~/components/opinion-card";
import { getOpinionsFromFilmId } from "~/constants/mocks";

const FilmOpinionsPage = ({ params }: { params: { filmId: string } }) =>
  getOpinionsFromFilmId(params.filmId).map((opinion) => (
    <OpinionCard key={opinion.opinionId} opinion={opinion} useFullWidth />
  ));

export default FilmOpinionsPage;
