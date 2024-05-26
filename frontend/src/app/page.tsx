"use client";

import { OpinionOption, type Opinion } from "../schema/Opinion";
import { OpinionCard } from "../components/opinion-card";
import { DislikeIcon } from "../res/icons/dislike";
import { LikeIcon } from "../res/icons/like";
import { differenceInDays } from "~/utilities/differenceInDays";
import { colors } from "../styles/colors";

const topOpinions: Opinion[] = [
  {
    opinionId: "a",
    title:
      "Will Kalki cross Jawaan's first day box office collection of Rs. 75 Crore in India?",
    startDate: "May 26, 2024",
    endDate: "June 15, 2024",
    filmId: "film-1",
    votes: [
      { option: OpinionOption.Yes, participationCount: 250, coins: 5235 },
      { option: OpinionOption.No, participationCount: 179, coins: 3875 },
    ],
    userVote: { selectedOption: OpinionOption.Yes, coinsUsed: 25 },
  },
  {
    opinionId: "b",
    title: "Will Puspa 2 include cameo from Lord Bobby?",
    startDate: "May 20, 2024",
    endDate: "June 17, 2024",
    filmId: "film-2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 214, coins: 4230 },
      { option: OpinionOption.No, participationCount: 140, coins: 3975 },
    ],
    userVote: { selectedOption: OpinionOption.No, coinsUsed: 12 },
  },
  {
    opinionId: "c",
    title: "Will there be sequel of Pushpa 2?",
    startDate: "May 25, 2024",
    endDate: "July 15, 2024",
    filmId: "film-2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 198, coins: 2230 },
      { option: OpinionOption.No, participationCount: 126, coins: 2955 },
    ],
  },
];

export default function Page() {
  return <TopOpinions />;
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
          style={{ width: `calc(18rem * ${topOpinions.length || 1})` }} // 18rem is for w-72, which is card width
        >
          {topOpinions.map((opinion) => (
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
