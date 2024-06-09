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
import { PredictionMeter, type PredictionMeterProps } from "./prediction-meter";
import { getFilmInfo } from "~/constants/mocks";
import { useRouter } from "next/navigation";
import { ResultChip } from "./result-chip";

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

  const predictionMeterProps: PredictionMeterProps = isResult
    ? {
        prediction,
        noButton: true,
        pivotValue: prediction.result?.finalValue,
        pivotLabel: prediction.result?.finalValue?.toString(),
      }
    : { prediction };

  return (
    <Card className="h-50 my-2 w-full p-3" isBlurred>
      {!noHeader && (
        <CardHeader className="flex flex-col items-start p-0">
          {isResult && (
            <ResultChip
              endDate={prediction.endDate}
              hasUserParticipated={!!prediction.userPrediction}
              result={prediction.result}
            />
          )}
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
        <p className="w-full text-small font-semibold">{prediction.title}</p>
        <PredictionMeter {...predictionMeterProps} />
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
