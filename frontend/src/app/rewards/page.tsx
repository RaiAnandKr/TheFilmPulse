"use client";

import { Card, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { Rewards } from "~/components/rewards";
import { OpinionCard } from "~/components/opinion-card";
import { PredictionCard } from "~/components/prediction-card";
import { CoinType } from "~/schema/CoinType";
import type { Opinion } from "~/schema/Opinion";
import type { Prediction } from "~/schema/Prediction";
import { PulseType } from "~/schema/PulseType";
import { numberInShorthand } from "~/utilities/numberInShorthand";
import { useMainStore } from "~/data/contexts/store-context";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { differenceInDays } from "~/utilities/differenceInDays";
import type { MainStore } from "~/data/store/main-store";
import { useLoadPastParticipationsData } from "~/data/hooks/useLoadPastParticipationsData";
import { ClaimedCoupons } from "~/components/claimed-coupons";
import { userTotalCoinsSelector } from "~/data/store/selectors/userTotalCoinsSelector";

const RewardsPage = () => {
  const userTotalCoins = useMainStore(userTotalCoinsSelector);

  return (
    <>
      <SectionHeader
        title={
          <div className="flex justify-between">
            <span>Total Coins : </span>
            <span>{numberInShorthand(userTotalCoins)} </span>
          </div>
        }
      />
      <CoinsInfo />
      <SectionHeader title="Claimed Coupons" />
      <ClaimedCoupons />
      <SectionHeader title="Reveal Rewards" />
      <Rewards />
      <SectionHeader title="Past Participations" />
      <PastParticipations />
    </>
  );
};

const SectionHeader: React.FC<{ title: string | JSX.Element }> = (props) => (
  <h2 className="p-2 font-bold text-primary">{props.title}</h2>
);

const CoinsInfo = () => {
  const userCoins = useMainStore((state) => state.userCoins);

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
  useLoadPastParticipationsData();

  const { userPastParticipations } = useMainStore((state) => ({
    userPastParticipations: userPastParticipationSelector(state),
  }));

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
    ...filterMapValuesInArray(
      state.predictions,
      (_, prediction) => !!(prediction.userPrediction && prediction.result),
    ),
    ...filterMapValuesInArray(
      state.opinions,
      (_, opinion) => !!(opinion.userVote && opinion.result),
    ),
  ].sort((pulse1, pulse2) =>
    differenceInDays(new Date(pulse2.endDate), new Date(pulse1.endDate)),
  );
};

export default RewardsPage;
