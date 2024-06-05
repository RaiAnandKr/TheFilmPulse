"use client";

import { OpinionCard } from "~/components/opinion-card";
import { TOP_OPINIONS } from "~/constants/mocks";

const OpinionPage = () =>
  TOP_OPINIONS.map((opinion) => (
    <OpinionCard opinion={opinion} key={opinion.opinionId} useFullWidth />
  ));

export default OpinionPage;
