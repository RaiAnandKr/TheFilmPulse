import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@nextui-org/react";
import type { Film } from "../schema/Film";
import { EndTimer, TotalParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";

interface FilmPredictionsCardProps {
  film: Film;
}

export const FilmPredictionsCard: React.FC<FilmPredictionsCardProps> = (
  props,
) => {
  const { title, filmCasts, imgSrc, predictions } = props.film;

  const endDate = predictions?.[0]?.endDate;

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
        {predictions?.map((prediction) => (
          <div key={prediction.predictionId} className="py-2">
            <div className="flex w-full items-center justify-between">
              <p className="w-44 overflow-hidden text-ellipsis text-nowrap text-small font-semibold">
                {prediction.title}
              </p>
              <TotalParticipations
                totalParticipations={prediction.participationCount}
              />
            </div>
            <PredictionMeter prediction={prediction} />
          </div>
        ))}
      </CardBody>
      {endDate && (
        <CardFooter className="justify-center p-0">
          <EndTimer endDate={endDate} />
        </CardFooter>
      )}
    </Card>
  );
};
