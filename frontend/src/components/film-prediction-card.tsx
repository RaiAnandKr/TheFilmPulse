import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Link,
} from "@nextui-org/react";
import type { Film } from "../schema/Film";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { useRouter } from "next/navigation";

interface FilmPredictionCardProps {
  film: Film;
}

export const FilmPredictionCard: React.FC<FilmPredictionCardProps> = (
  props,
) => {
  const {
    title,
    filmCasts,
    imgSrc,
    releaseDate,
    topPrediction: prediction,
    filmId,
  } = props.film;

  const router = useRouter();

  const onCardPress = () => {
    router.push(`film/${filmId}`);
  };

  return (
    <div className="p-2">
      <Card
        isFooterBlurred
        className="h-[420px] w-full"
        isPressable
        as={"div"}
        onPress={onCardPress}
      >
        <CardHeader className="absolute z-10 flex-col items-start bg-black/40 backdrop-blur backdrop-saturate-150">
          <h3 className="text-md overflow-hidden text-ellipsis text-nowrap font-medium text-white/90 ">
            {title}
          </h3>
          <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-bold text-white/60">
            {filmCasts}
          </p>
          <Chip
            size="sm"
            radius="sm"
            className="mt-2"
            color="warning"
            variant="flat"
            classNames={{ content: "font-bold" }}
          >
            Releasing on {releaseDate}
          </Chip>
        </CardHeader>
        <Image
          removeWrapper
          alt="Film Poster"
          className="z-0 h-full w-full object-cover"
          src={imgSrc}
        />
        <CardFooter className="absolute bottom-0 z-10 flex flex-col border-t-1 border-default-600 bg-black/40 font-medium dark:border-default-100">
          <div className="flex w-full items-start justify-between pb-2">
            <p className="w-10/12 text-start text-small text-white/90">
              {prediction.title}
            </p>
            <Link
              href="/pulse/predictions"
              color="warning"
              className="text-small underline"
            >
              More
            </Link>
          </div>

          <PredictionMeter prediction={prediction} inDarkTheme />

          <TimerAndParticipations
            endDate={prediction.endDate}
            totalParticipations={prediction.participationCount}
            showInRow
          />
        </CardFooter>
      </Card>
    </div>
  );
};
