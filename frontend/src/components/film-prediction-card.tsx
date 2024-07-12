import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Skeleton,
} from "@nextui-org/react";
import type { Film } from "../schema/Film";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { useRouter } from "next/navigation";
import { ExpandCircleIcon } from "~/res/icons/expand-circle";
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

  const onMorePredictionsClick = () => {
    router.push(`/film/${filmId}/predictions`);
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
          <p className="overflow-hidden text-ellipsis text-nowrap text-tiny text-white/80">
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
          <CardFooter className="absolute bottom-0 z-10 flex flex-col border-t-1 border-default-600 bg-black/40 pt-2 font-medium dark:border-default-100">
            <div className="flex w-full items-center justify-between pb-2">
              <h4 className="flex w-10/12 gap-2 text-start text-medium font-bold text-warning">
                <span>Predict and Win</span>
                <CoinsImage />
                <GiftBoxImage />
              </h4>
              <Button
                isIconOnly
                color="warning"
                variant="light"
                radius="sm"
                onClick={onMorePredictionsClick}
                size="sm"
              >
                <ExpandCircleIcon />
              </Button>
            </div>

            <PredictionMeter prediction={prediction} inDarkTheme />

            <TimerAndParticipations
              endDate={prediction.endDate}
              totalParticipations={prediction.participationCount}
              showInRow
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export const FilmPredictionCardSkeleton: React.FC = () => {
  return (
    <div className="p-2">
      <Card isFooterBlurred className="h-[450px] w-full" isPressable as={"div"}>
        <CardHeader className="flex flex-col items-start gap-2 p-3">
          <Skeleton className="h-4 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-5 w-2/5 rounded-lg" />
        </CardHeader>
        <Skeleton className="h-52" />
        <CardFooter className="flex w-full flex-col items-start gap-3 p-3">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-4 w-3/5 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-1/5 rounded-lg" />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <Skeleton className="h-3 w-3/4 rounded-lg" />
            <Skeleton className="h-10 w-1/4 rounded-lg" />
          </div>
          <div className="flex w-full items-center justify-between p-2">
            <Skeleton className="h-3 w-1/5 rounded-lg" />
            <Skeleton className="h-3 w-1/5 rounded-lg" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
