"use client";

import { OpinionCard } from "~/components/opinion-card";
import { getOpinionsFromFilmId } from "~/constants/mocks";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { useScrollToTop } from "~/hooks/useScrollToTop";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";

const FilmOpinionsPage = ({ params }: { params: { filmId: string } }) => {
  const { filmId } = params;
  useScrollToTop();

  const { filmOpinions, setFilmOpinions } = useMainStore((state) => ({
    filmOpinions: filterMapValuesInArray(
      state.opinions,
      (_, opinion) => opinion.filmId === filmId,
    ),
    setFilmOpinions: state.setFilmOpinions,
  }));

  useLoadData(
    `filmOpinions?filmId=${filmId}`,
    () => getOpinionsFromFilmId(filmId),
    (opinions) => setFilmOpinions(filmId, opinions),
  );

  return filmOpinions.map((opinion) => (
    <OpinionCard
      key={opinion.opinionId}
      opinion={opinion}
      useFullWidth
      useFooter
    />
  ));
};

export default FilmOpinionsPage;
