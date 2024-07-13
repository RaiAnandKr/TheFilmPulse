import { Card, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";
import { TimerAndParticipationsSkeleton } from "./timer-and-participations-skeleton";
import { PredictionMeterSkeleton } from "./prediction-meter-skeleton";

const FilmPredictionCardSkeleton: React.FC = () => {
  return (
    <div className="p-2">
      <Card isFooterBlurred className="h-[450px] w-full" isPressable as={"div"}>
        <CardHeader className="flex flex-col items-start gap-2 p-3">
          <Skeleton className="h-4 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-5 w-2/5 rounded-lg" />
        </CardHeader>
        <Skeleton className="h-48" />
        <CardFooter className="flex w-full flex-col items-start gap-2 p-3">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-4 w-3/5 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <PredictionMeterSkeleton />
          <TimerAndParticipationsSkeleton showInRow />
        </CardFooter>
      </Card>
    </div>
  );
};

export const FilmPredictionCardSkeletons: React.FC<{ repeat?: number }> = (
  props,
) => {
  const { repeat = 2 } = props;
  return (
    <>
      {Array(repeat)
        .fill(1)
        .map((_, index) => (
          <FilmPredictionCardSkeleton key={index} />
        ))}
    </>
  );
};
