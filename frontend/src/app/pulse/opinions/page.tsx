"use client";

import { OpinionCard } from "~/components/opinion-card";
import { getOpinions } from "~/constants/mocks";

const OpinionPage = () =>
  getOpinions({ isActive: true }).map((opinion) => (
    <OpinionCard opinion={opinion} key={opinion.opinionId} useFullWidth />
  ));

export default OpinionPage;
