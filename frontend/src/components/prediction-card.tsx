import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";
import type { Prediction } from "../schema/Film";
import {
  TimerAndParticipations,
  TotalParticipations,
} from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { getFilmInfo } from "~/constants/mocks";

interface PredictionCardProps {
  prediction: Prediction;
}

export const PredictionCard: React.FC<PredictionCardProps> = (props) => {
  const { prediction } = props;

  const film = getFilmInfo(prediction.predictionId);

  if (!film) {
    return null;
  }

  const { title, imgSrc, filmCasts } = film;

  return (
    <Card className="h-50 my-2 w-full p-3" isBlurred>
      <CardHeader className="flex items-center p-0">
        <Image
          alt="nextui logo"
          height={48}
          radius="sm"
          src={imgSrc}
          width={48}
          className="max-h-12 max-w-12"
        />
        <div className="flex flex-col px-2">
          <h3 className="text-md overflow-hidden text-ellipsis text-nowrap font-bold ">
            {title}
          </h3>
          <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-medium ">
            {filmCasts}
          </p>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col p-0">
        <div className="py-2">
          <div className="flex w-full items-center justify-between">
            <p className="text-small font-semibold">{prediction.title}</p>
          </div>
          <PredictionMeter prediction={prediction} />
        </div>
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
