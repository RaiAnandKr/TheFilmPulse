"use client";

import { OpinionOption } from "../schema/Opinion";
import { OpinionCard } from "../components/opinion-card";
import { DislikeIcon } from "../res/icons/dislike";
import { LikeIcon } from "../res/icons/like";
import { differenceInDays } from "../utilities/differenceInDays";
import { FilmPredictionCard } from "../components/film-prediction-card";
import { TOP_OPINIONS, FILMS } from "../constants/mocks";
import { colors } from "../styles/colors";

export default function Page() {
  return (
    <>
      <TopOpinions />
      <FilmPredictions />
    </>
  );
}

const TopOpinions = () => {
  return (
    <>
      <h2 className="p-2 font-bold" style={{ color: colors.primary }}>
        Top Opinions
      </h2>
      <div className="w-full overflow-x-auto">
        <div
          className="flex bg-teal-50"
          style={{ width: `calc(18rem * ${TOP_OPINIONS.length || 1})` }} // 18rem is for w-72, which is card width
        >
          {TOP_OPINIONS.map((opinion) => (
            <OpinionCard
              title={opinion.title}
              key={opinion.opinionId}
              daysToEnd={differenceInDays(
                new Date(),
                new Date(opinion.endDate),
              )}
              options={opinion.votes.map((vote) => ({
                key: vote.option,
                label: vote.option,
                color: vote.option === OpinionOption.Yes ? "success" : "danger",
                icon:
                  vote.option === OpinionOption.Yes ? (
                    <LikeIcon />
                  ) : (
                    <DislikeIcon />
                  ),
              }))}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const FilmPredictions = () => {
  return (
    <>
      <h2 className="p-2 font-bold" style={{ color: colors.primary }}>
        Film Predictions
      </h2>
      {FILMS.map((film) => (
        <FilmPredictionCard key={film.filmId} film={film} />
      ))}
    </>
  );
};
