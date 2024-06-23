"use client";

import { Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { Rewards } from "~/components/rewards";
import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { getPastParticipations, getUserCoins } from "~/constants/mocks";
import { CoinType } from "~/schema/CoinType";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { PulseType } from "~/schema/PulseType";
import { numberInShorthand } from "~/utilities/numberInShorthand";
import { useMainStore } from "~/data/contexts/store-context";
import { useLoadData } from "~/data/hooks/useLoadData";
import { pick } from "~/utilities/pick";
import { filterMapValues } from "~/utilities/filterMapValues";
import { differenceInDays } from "~/utilities/differenceInDays";
import { MainStore } from "~/data/store/main-store";

const RewardsPage = () => (
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
  const { userCoins, setUserCoins } = useMainStore((state) =>
    pick(state, ["userCoins", "setUserCoins"]),
  );

  useLoadData("getUserCoins", getUserCoins, setUserCoins);

  return (
    <div className="bg-success-to-danger flex w-full justify-evenly gap-3 p-2 py-3">
      {userCoins.map((userCoin) => (
        <CoinCard
          key={userCoin.type}
          coinType={userCoin.type}
          coins={userCoin.coins}
          subText={userCoin.isRedeemable ? "Redeemable" : "Non-redeemable"}
        />
      ))}
    </div>
  );
};

const CoinCard: React.FC<{
  coinType: CoinType;
  coins: number;
  subText?: string;
}> = (props) => {
  const { coinType, coins, subText } = props;

  const specialCardClass =
    coinType === CoinType.Earned ? "ring-primary ring-2" : "";

  return (
    <Card className={`w-full ${specialCardClass} text-primary`} isBlurred>
      <CardBody className="flex-row items-center justify-center p-2 text-4xl font-bold">
        <span>{numberInShorthand(coins)}</span>
      </CardBody>
      <CardFooter className="flex-col justify-center p-0 pb-2 text-black">
        <Chip variant="light" className="h-full" style={{ color: "inherit" }}>
          {coinType} coins
        </Chip>
        {subText && (
          <span className="text-tiny text-default-500">({subText})</span>
        )}
      </CardFooter>
    </Card>
  );
};

const PastParticipations = () => {
  const { userPastParticipations, updateOpinions, updatePredictions } =
    useMainStore((state) => ({
      ...pick(state, ["updateOpinions", "updatePredictions"]),
      userPastParticipations: userPastParticipationSelector(state),
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

  return (
    <div className="bg-success-to-danger flex w-full flex-col p-3">
      {userPastParticipations.map((pulse) =>
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

const userPastParticipationSelector = (
  state: MainStore,
): (Prediction | Opinion)[] => {
  return [
    ...filterMapValues(
      state.predictions,
      (_, prediction) => !!(prediction.userPrediction && prediction.result),
    ),
    ...filterMapValues(
      state.opinions,
      (_, opinion) => !!(opinion.userVote && opinion.result),
    ),
  ].sort((pulse1, pulse2) =>
    differenceInDays(new Date(pulse2.endDate), new Date(pulse1.endDate)),
  );
};

export default RewardsPage;
