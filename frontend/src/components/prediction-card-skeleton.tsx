import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import { TimerAndParticipationsSkeleton } from "./timer-and-participations-skeleton";
import { PredictionMeterSkeleton } from "./prediction-meter-skeleton";

interface PredictionCardSkeletonProps {
  noHeader?: boolean;
}

const PredictionCardSkeleton: React.FC<PredictionCardSkeletonProps> = (
  props,
) => {
  const { noHeader } = props;
  return (
    <Card className="h-50 my-2 w-full p-3" isBlurred>
      {!noHeader && (
        <CardHeader className="flex w-full items-center p-0">
          <Skeleton className="h-11 w-11 flex-none rounded-lg" />
          <div className="flex w-full flex-col gap-2 px-2">
            <Skeleton className="h-5 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </CardHeader>
      )}
      <CardBody className="flex flex-col gap-2 p-0 py-2">
        <PredictionMeterSkeleton />
      </CardBody>

      <CardFooter className="justify-center p-0">
        <TimerAndParticipationsSkeleton showInRow />
      </CardFooter>
    </Card>
  );
};

export const PredictionCardSkeletons: React.FC<
  { repeat?: number } & PredictionCardSkeletonProps
> = (props) => {
  const { repeat = 3, ...otherProps } = props;
  return (
    <>
      {Array(repeat)
        .fill(1)
        .map((_, index) => (
          <PredictionCardSkeleton {...otherProps} key={index} />
        ))}
    </>
  );
};
