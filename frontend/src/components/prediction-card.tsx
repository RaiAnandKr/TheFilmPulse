import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";
import type { Prediction } from "~/schema/Prediction";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { getFilmInfo } from "~/constants/mocks";
import { useRouter } from "next/navigation";
import { ResultChip } from "./result-chip";
import { TrophyIcon } from "~/res/icons/trophy";
import { numberInShorthand } from "~/utilities/numberInShorthand";

interface PredictionCardProps {
  prediction: Prediction;
  noHeader?: boolean;
  isResult?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = (props) => {
  const { prediction, noHeader, isResult } = props;
  const film = getFilmInfo(prediction.predictionId);

  const router = useRouter();

  if (!film) {
    return null;
  }

  const onFilmPosterClick = () => {
    router.push(`/film/${film.filmId}/predictions`);
  };

  const { title, imgSrc, filmCasts } = film;

  return (
    <Card className="h-50 my-2 w-full p-3" isBlurred>
      {!noHeader && (
        <CardHeader className="flex flex-col items-start p-0">
          {isResult && <PredictionResult {...prediction} />}
          <div className="flex items-center">
            <Button isIconOnly radius="sm" onClick={onFilmPosterClick}>
              <Image
                alt="nextui logo"
                height={48}
                src={
                  imgSrc ??
                  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                }
                width={48}
                className="max-h-12 max-w-12"
              />
            </Button>

            <div className="flex flex-col px-2">
              <h3 className="text-md overflow-hidden text-ellipsis text-nowrap font-bold ">
                {title}
              </h3>
              <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-medium ">
                {filmCasts}
              </p>
            </div>
          </div>
        </CardHeader>
      )}
      <CardBody className="flex flex-col p-0 py-2">
        {isResult ? (
          <PredictionDiff {...prediction} />
        ) : (
          <PredictionMeter prediction={prediction} />
        )}
      </CardBody>
      <CardFooter className="justify-center p-0">
        <TimerAndParticipations
          endDate={prediction.endDate}
          totalParticipations={prediction.participationCount}
          showInRow
        />
      </CardFooter>
    </Card>
  );
};

const PredictionDiff: React.FC<
  Pick<Prediction, "userPrediction" | "result" | "predictionScaleUnit">
> = (props) => {
  const { userPrediction, result, predictionScaleUnit } = props;
  if (userPrediction === undefined || !result) {
    return <p className="text-sm text-default-500">No result</p>;
  }
  return (
    <div className="flex flex-col pt-2 text-sm">
      <div className="flex justify-between text-primary">
        <span>Actual result :</span>
        <span>
          {result?.finalValue ?? 0} {predictionScaleUnit}
        </span>
      </div>
      <div className="flex justify-between text-default-500">
        <span>Your prediction :</span>
        <span>
          {userPrediction} {predictionScaleUnit}
        </span>
      </div>
    </div>
  );
};

const PredictionResult: React.FC<
  Pick<Prediction, "endDate" | "userPrediction" | "result">
> = (props) => {
  const { endDate, userPrediction, result } = props;
  return (
    <div className="flex w-full items-center justify-between">
      <ResultChip
        endDate={endDate}
        hasUserParticipated={!!userPrediction}
        result={result}
      />
      {!!result?.ranking && (
        <div className="mb-2 flex items-center text-sm font-bold text-primary">
          <TrophyIcon />
          <span className="mx-1">Rank {numberInShorthand(result.ranking)}</span>
        </div>
      )}
    </div>
  );
};
