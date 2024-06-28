"use client";

import { OpinionCard } from "~/components/opinion-card";
import { getOpinions } from "~/service/apiUtils";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";

const OpinionPage = () => {
  const { opinions, setActiveOpinions } = useMainStore((state) => ({
    opinions: filterMapValuesInArray(
      state.opinions,
      (_, opinion) => !!opinion.isActive,
    ),
    setActiveOpinions: state.setActiveOpinions,
  }));

  useLoadData(
    "activeOpinions",
    () => getOpinions({ isActive: true }),
    setActiveOpinions,
  );

  return opinions.map((opinion) => (
    <OpinionCard opinion={opinion} key={opinion.opinionId} useFullWidth />
  ));
};

export default OpinionPage;
