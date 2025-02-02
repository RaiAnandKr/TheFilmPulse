import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from "@nextui-org/react";
import type { Film } from "../schema/Film";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { useRouter } from "next/navigation";
import { CoinsImage } from "~/res/images/CoinsImage";
import { GiftBoxImage } from "~/res/images/GiftBoxImage";
import { useMainStore } from "~/data/contexts/store-context";

interface FilmPredictionCardProps {
  film: Film;
}

export const FilmPredictionCard: React.FC<FilmPredictionCardProps> = (
  props,
) => {
  const { title, filmCasts, imgSrc, releaseDate, topPrediction, filmId } =
    props.film;

  const prediction = useMainStore((state) =>
    state.predictions.get(topPrediction.predictionId),
  );

  const router = useRouter();

  const onCardPress = () => {
    router.push(`film/${filmId}`);
  };

  return (
    <div className="p-2">
      <Card
        isFooterBlurred
        className="h-[450px] w-full"
        isPressable
        as={"div"}
        onPress={onCardPress}
      >
        <CardHeader className="absolute z-10 flex-col items-start bg-gradient-to-r from-black/90 from-30%">
          <h3 className="text-md overflow-hidden text-ellipsis text-nowrap font-bold text-white/80">
            {title}
          </h3>
          <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-semibold text-white/80">
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
            Releasing {releaseDate}
          </Chip>
        </CardHeader>
        <Image
          removeWrapper
          alt="Film Poster"
          className="z-0 h-full w-full object-cover"
          src={imgSrc}
        />
        {!!prediction && (
          <CardFooter className="absolute bottom-0 z-10 flex flex-col border-t-1 border-default-600 bg-black/80 pt-2 font-medium dark:border-default-100">
            <div className="flex w-full items-center justify-between pb-2">
              <h4 className="flex w-10/12 gap-2 text-start text-medium font-bold text-warning">
                <span>Predict and Win</span>
                <CoinsImage />
                <GiftBoxImage />
              </h4>
            </div>

            <PredictionMeter prediction={prediction} inDarkTheme />

            <TimerAndParticipations
              endDate={prediction.endDate}
              totalParticipations={prediction.participationCount}
              showInRow
              isDarkTheme
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
