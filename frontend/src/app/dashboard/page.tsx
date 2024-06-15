"use client";

import { Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { Rewards } from "~/components/rewards";
import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { getOpinions, getPredictions } from "~/constants/mocks";
import { CoinType } from "~/schema/CoinType";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { PulseType } from "~/schema/PulseType";
import { numberInShorthand } from "~/utilities/numberInShorthand";

const Dashboard = () => (
  <>
    <SectionHeader
      title={
        <div className="flex justify-between">
          <span>Total Coins : </span>
          <span>{500} </span>
        </div>
      }
    />
    <CoinsInfo />
    <SectionHeader title="Rewards" />
    <Rewards />
    <SectionHeader title="Past Participations" />
    <PastParticipations />
  </>
);

const SectionHeader: React.FC<{ title: string | JSX.Element }> = (props) => (
  <h2 className="p-2 font-bold text-primary">{props.title}</h2>
);

const CoinsInfo = () => {
  return (
    <div className="bg-success-to-danger flex w-full justify-evenly p-2 py-3">
      <CoinCard coinType={CoinType.Earned} coins={450} />
      <CoinCard coinType={CoinType.Bonus} coins={50} />
    </div>
  );
};

const CoinCard: React.FC<{ coinType: CoinType; coins: number }> = (props) => {
  const { coinType, coins } = props;

  const specialCardClass =
    coinType === CoinType.Earned ? "ring-primary ring-2" : "";

  return (
    <Card className={`mx-2 w-full ${specialCardClass} text-primary`} isBlurred>
      <CardBody className="flex-row items-center justify-center p-2 text-4xl font-bold">
        <span>{numberInShorthand(coins)}</span>
      </CardBody>
      <CardFooter className="justify-center p-0 pb-2 text-black">
        <Chip
          variant="light"
          className="h-full font-bold"
          style={{ color: "inherit" }}
        >
          {coinType} coins
        </Chip>
      </CardFooter>
    </Card>
  );
};

const PastParticipations = () => {
  const pastParticipationsByUser: (Opinion | Prediction)[] = [
    ...getOpinions({ isActive: false }),
    ...getPredictions({ isActive: false }),
  ].filter(
    (pulse) =>
      !!(
        ((pulse as Opinion).userVote || (pulse as Prediction).userPrediction) &&
        pulse.result
      ),
  );

  return (
    <div className="bg-success-to-danger flex w-full flex-col p-3">
      {pastParticipationsByUser.map((pulse) =>
        pulse.type === PulseType.Opinion ? (
          <OpinionCard opinion={pulse} key={pulse.opinionId} useFullWidth />
        ) : (
          <PredictionCard
            key={pulse.predictionId}
            prediction={pulse}
            isResult
          />
        ),
      )}
    </div>
  );
};

export default Dashboard;
