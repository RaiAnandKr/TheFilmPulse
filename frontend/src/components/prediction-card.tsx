import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";
import type { Prediction } from "../schema/Film";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { getFilmInfo } from "~/constants/mocks";
import { useRouter } from "next/navigation";

interface PredictionCardProps {
  prediction: Prediction;
  noHeader?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = (props) => {
  const { prediction, noHeader } = props;
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
        <CardHeader className="flex items-center p-0">
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
        </CardHeader>
      )}
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
