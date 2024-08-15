"use client";

import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { useMainStore } from "~/data/contexts/store-context";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { useLoadUserParticipationsData } from "~/data/hooks/useLoadUserParticipationsData";
import type { MainStore } from "~/data/store/main-store";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { ContestType } from "~/schema/ContestType";

const ParticipationPage = () => {
  useLoadUserParticipationsData();

  const { userParticipations } = useMainStore((state) => ({
    userParticipations: userParticipationSelector(state),
  }));

  return (
    <div className="bg-success-to-danger flex w-full flex-col">
      {userParticipations.length ? (
        userParticipations.map((contest) =>
          contest.type === ContestType.Opinion ? (
            <OpinionCard
              opinion={contest}
              key={contest.opinionId}
              useFullWidth
              showResult
            />
          ) : (
            <PredictionCard
              key={contest.predictionId}
              prediction={contest}
              showResult
            />
          )
        )
      ) : (
        <p className="text-tiny text-danger"> No participations!</p>
      )}
    </div>
  );
};

const userParticipationSelector = (
  state: MainStore,
): (Prediction | Opinion)[] => {
  return [
    ...filterMapValuesInArray(
      state.predictions,
      (_, prediction) => !!prediction.userPrediction,
    ),
    ...filterMapValuesInArray(
      state.opinions,
      (_, opinion) => !!opinion.userVote,
    ),
  ].sort((contest1, contest2) =>
    // Combine opinions and predictions and sort them in descending order of end date.
    new Date(contest2.endDate).getTime() - new Date(contest1.endDate).getTime()
  );
};

export default ParticipationPage;
