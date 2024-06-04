"use client";

import { OpinionCard } from "~/components/opinion-card";
import { TOP_OPINIONS } from "~/constants/mocks";
import { DislikeIcon } from "~/res/icons/dislike";
import { LikeIcon } from "~/res/icons/like";
import { OpinionOption } from "~/schema/Opinion";

const OpinionPage = () =>
  TOP_OPINIONS.map((opinion) => (
    <OpinionCard
      title={opinion.title}
      key={opinion.opinionId}
      endDate={opinion.endDate}
      userVote={opinion.userVote}
      filmPosterSrc={opinion.filmPosterSrc}
      options={opinion.votes.map((vote) => ({
        key: vote.option,
        label: vote.option,
        color: vote.option === OpinionOption.Yes ? "success" : "danger",
        icon:
          vote.option === OpinionOption.Yes ? <LikeIcon /> : <DislikeIcon />,
        votes: vote.participationCount,
        coins: vote.coins,
      }))}
      useFullWidth
    />
  ));

export default OpinionPage;
