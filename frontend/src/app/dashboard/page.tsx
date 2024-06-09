"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@nextui-org/react";
import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { getOpinions, getPredictions } from "~/constants/mocks";
import { CoinIcon } from "~/res/icons/coin";
import { InfoIcon } from "~/res/icons/info";
import { CoinType } from "~/schema/CoinType";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { PulseType } from "~/schema/PulseType";
import { numberInShorthand } from "~/utilities/numberInShorthand";
import { shuffle } from "~/utilities/shuffle";

const Dashboard = () => (
  <>
    <SectionHeader title="Total coins: 500" />
    <CoinsInfo />
    <SectionHeader title="Rewards" />
    <Rewards />
    <SectionHeader title="Past Participations" />
    <PastParticipations />
  </>
);

const SectionHeader: React.FC<{ title: string }> = (props) => (
  <p className="p-2 font-bold text-primary">{props.title}</p>
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
    coinType === CoinType.Earned ? "text-black ring-black" : "";

  return (
    <Card
      className={`mx-2 w-full text-stone-500 ring-2 ring-stone-500 ${specialCardClass}`}
      isBlurred
    >
      <CardBody className="flex-row items-center justify-center text-4xl font-bold">
        <CoinIcon dynamicSize />
        <Spacer x={2} />
        <span>{numberInShorthand(coins)}</span>
      </CardBody>
      <CardFooter className="justify-center">
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button
              variant="light"
              className="h-full font-bold"
              style={{ color: "inherit" }}
              endContent={<InfoIcon />}
            >
              {coinType}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Popover Content</div>
              <div className="text-tiny">This is the popover content</div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

const Rewards = () => <></>;

const PastParticipations = () => {
  const pastParticipationsByUser: (Opinion | Prediction)[] = [
    ...getOpinions({ isActive: false }),
    ...getPredictions({ isActive: false }),
  ].filter(Boolean);

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
