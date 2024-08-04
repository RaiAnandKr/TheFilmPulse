"use client";

import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { useMainStore } from "~/data/contexts/store-context";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { differenceInDays } from "~/utilities/differenceInDays";
import { useLoadUserParticipationsData } from "~/data/hooks/useLoadUserParticipationsData";
import type { MainStore } from "~/data/store/main-store";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { PulseType } from "~/schema/PulseType";

const ParticipationPage = () => {
  useLoadUserParticipationsData();

  const { userParticipations } = useMainStore((state) => ({
    userParticipations: userParticipationSelector(state),
  }));

  return (
    <div className="bg-success-to-danger flex w-full flex-col p-3">
      {userParticipations.length ? (
        userParticipations.map((pulse) =>
          pulse.type === PulseType.Opinion ? (
            <OpinionCard
              opinion={pulse}
              key={pulse.opinionId}
              useFullWidth
              showResult
            />
          ) : (
            <PredictionCard
              key={pulse.predictionId}
              prediction={pulse}
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
  ].sort((pulse1, pulse2) =>
    differenceInDays(new Date(pulse2.endDate), new Date(pulse1.endDate))
  );
};

export default ParticipationPage;
