import { pick } from "~/utilities/pick";
import { useMainStore } from "../contexts/store-context";
import type { Prediction } from "~/schema/Prediction";
import type { Opinion } from "~/schema/Opinion";
import { PulseType } from "~/schema/PulseType";
import { getPastParticipations } from "~/constants/mocks";
import { useLoadData } from "./useLoadData";

export const useLoadPastParticipationsData = () => {
  const { updateOpinions, updatePredictions } = useMainStore((state) => ({
    ...pick(state, ["updateOpinions", "updatePredictions"]),
  }));

  useLoadData("pastParticipations", getPastParticipations, (participations) => {
    updateOpinions(
      "userPastOpinions",
      participations.filter(
        (pulse) => pulse.type === PulseType.Opinion,
      ) as Opinion[],
    );
    updatePredictions(
      "userPastPredictions",
      participations.filter(
        (pulse) => pulse.type === PulseType.Prediction,
      ) as Prediction[],
    );
  });
};
