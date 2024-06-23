import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Progress,
  CardHeader,
  Image,
  cn,
} from "@nextui-org/react";
import type { Vote, Opinion, UserVote } from "../schema/Opinion";
import { OpinionOption } from "~/schema/OpinionOption";
import { TimerAndParticipations } from "./timer-and-participations";
import { numberInShorthand } from "../utilities/numberInShorthand";
import { LikeIcon } from "~/res/icons/like";
import { DislikeIcon } from "~/res/icons/dislike";
import { useRouter } from "next/navigation";
import { ResultChip } from "./result-chip";
import { CoinsImage } from "~/res/images/CoinsImage";
import { OptionButton } from "./option-button";
import type { MainStore } from "~/data/store/main-store";
import { useMainStore } from "~/data/contexts/store-context";
import { pick } from "~/utilities/pick";
import { CoinType } from "~/schema/CoinType";
import { postUpdateUserCoins, postUserOpinion } from "~/constants/mocks";

interface OpinionProps {
  opinion: Opinion;
  useFullWidth?: boolean;
  useFooter?: boolean;
}

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { useFullWidth, opinion, useFooter } = props;
  const { title, endDate, votes, filmId, result, opinionId, userVote } =
    opinion;

  const { film, addUserOpinion, updateUserCoins } = useMainStore((state) => ({
    film: opinionFilmSelector(state, opinionId),
    ...pick(state, ["addUserOpinion", "updateUserCoins"]),
  }));

  const onOpinionConfirmed = (userVote: UserVote) => {
    addUserOpinion(opinionId, userVote);
    postUserOpinion(opinionId, userVote);

    updateUserCoins(CoinType.Earned, userVote.coinsUsed /* deductBy */);
    postUpdateUserCoins(CoinType.Earned, userVote.coinsUsed /* deductBy */);
  };

  const router = useRouter();

  const onFilmPosterClick = () => {
    router.push(`/film/${filmId}/opinions`);
  };

  const totalParticipations = votes.reduce(
    (acc, vote) => acc + vote.participationCount,
    0,
  );

  const cardClassName = useFullWidth
    ? "h-50 p-2.5 my-2 w-full"
    : "h-50 p-2.5 m-2 w-72"; // Remember to change parent width if you change card width from w-72.

  return (
    <Card className={cardClassName} isBlurred>
      {!useFooter && (
        <CardHeader className="flex flex-col items-start p-0 pb-2">
          <ResultChip
            endDate={endDate}
            hasUserParticipated={!!userVote}
            result={result}
          />
          <div className="flex w-full items-start justify-between">
            <Button isIconOnly radius="sm" onClick={onFilmPosterClick}>
              <Image
                alt="Film Poster"
                height={48}
                src={
                  film?.imgSrc ??
                  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                }
                width={48}
                className="max-h-12 max-w-12"
              />
            </Button>
            <TimerAndParticipations
              endDate={endDate}
              totalParticipations={totalParticipations}
            />
          </div>
        </CardHeader>
      )}
      <CardBody className="p-0 py-2 text-sm">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col p-0 pt-2">
        <ParticipationTrend votes={votes} />
        <Options
          votes={votes}
          userVote={userVote}
          onOpinionConfirmed={onOpinionConfirmed}
        />
        {useFooter && (
          <TimerAndParticipations
            endDate={endDate}
            totalParticipations={totalParticipations}
            showInRow
          />
        )}
      </CardFooter>
    </Card>
  );
};

const Options: React.FC<{
  votes: Vote[];
  onOpinionConfirmed: (userVote: UserVote) => void;
  userVote?: UserVote;
}> = (props) => {
  const { votes, userVote, onOpinionConfirmed } = props;

  return (
    <div className="flex w-full justify-between gap-2 pb-1 pt-2.5">
      <OptionButton
        key={votes[0]?.option ?? OpinionOption.Yes}
        option={votes[0]?.option ?? OpinionOption.Yes}
        icon={<LikeIcon />}
        classNames={{
          buttonColor: "success",
          contentBgColor: "bg-success-100",
          contentTextColor: "text-success",
        }}
        votes={votes}
        userVote={userVote}
        onOpinionConfirmed={onOpinionConfirmed}
      />
      <OptionButton
        key={votes[1]?.option ?? OpinionOption.No}
        option={votes[1]?.option ?? OpinionOption.No}
        icon={<DislikeIcon />}
        classNames={{
          buttonColor: "danger",
          contentBgColor: "bg-danger-100",
          contentTextColor: "text-danger",
        }}
        votes={votes}
        userVote={userVote}
        onOpinionConfirmed={onOpinionConfirmed}
      />
    </div>
  );
};

const ParticipationTrend: React.FC<{ votes: Vote[] }> = (props) => {
  const { votes } = props;
  const coinsOnLike = votes.at(0)?.coins ?? 0;
  const coinsOnDislike = votes.at(1)?.coins ?? 0;
  const totalCoins = coinsOnLike + coinsOnDislike;
  const coinsOnLikePercent = (coinsOnLike * 100) / totalCoins;

  return (
    <Progress
      size="sm"
      radius="sm"
      classNames={{
        base: "max-w-md gap-1",
        track: "drop-shadow-md bg-rose-400 mx-1",
        indicator: "bg-green-400",
      }}
      value={coinsOnLikePercent}
      label={<Coins coins={coinsOnLike} colorClass="text-green-400" />}
      valueLabel={
        <Coins coins={coinsOnDislike} colorClass="text-rose-400" iconAtEnd />
      }
      showValueLabel
    />
  );
};

const Coins: React.FC<{
  coins: number;
  iconAtEnd?: boolean;
  colorClass?: string;
}> = (props) => (
  <div
    className={cn(
      "flex items-center gap-2 text-nowrap px-2 text-small font-semibold text-default-400",
      props.colorClass,
    )}
    style={{
      flexDirection: props.iconAtEnd ? "row-reverse" : "row",
    }}
  >
    <CoinsImage flip={props.iconAtEnd} />
    <p>{numberInShorthand(props.coins)} </p>
  </div>
);

const opinionFilmSelector = (state: MainStore, opinionId: string) => {
  const associatedFilmId = state.opinions.get(opinionId)?.filmId;
  if (!associatedFilmId) {
    return null;
  }

  const associatedFilm = state.films.get(associatedFilmId);
  return associatedFilm;
};
