"use client";

import { OpinionCard } from "~/components/opinion-card";
import { getOpinionsFromFilmId } from "~/constants/mocks";
import { useScrollToTop } from "~/hooks/useScrollToTop";

const FilmOpinionsPage = ({ params }: { params: { filmId: string } }) => {
  useScrollToTop();
  return getOpinionsFromFilmId(params.filmId).map((opinion) => (
    <OpinionCard key={opinion.opinionId} opinion={opinion} useFullWidth />
  ));
};

export default FilmOpinionsPage;
