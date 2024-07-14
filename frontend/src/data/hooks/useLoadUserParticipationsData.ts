import { pick } from "~/utilities/pick";
import { useMainStore } from "../contexts/store-context";
import type { Prediction } from "~/schema/Prediction";
import type { Opinion } from "~/schema/Opinion";
import { PulseType } from "~/schema/PulseType";
import { getPastParticipations } from "~/service/apiUtils";
import { useLoadData } from "./useLoadData";

export const useLoadUserParticipationsData = () => {
  const { updateOpinions, updatePredictions } = useMainStore((state) => ({
    ...pick(state, ["updateOpinions", "updatePredictions"]),
  }));

  return useLoadData(
    "userParticipations",
    getPastParticipations,
    (participations) => {
      updateOpinions(
        "userOpinionsParticipation",
        participations.filter(
          (pulse) => pulse.type === PulseType.Opinion,
        ) as Opinion[],
      );
      updatePredictions(
        "userPredictionsParticipation",
        participations.filter(
          (pulse) => pulse.type === PulseType.Prediction,
        ) as Prediction[],
      );
    },
  );
};
