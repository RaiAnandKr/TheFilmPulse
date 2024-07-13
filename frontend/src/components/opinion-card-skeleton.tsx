import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import { TimerAndParticipationsSkeleton } from "./timer-and-participations-skeleton";

interface OpinionCardSkeletonProps {
  useFullWidth?: boolean;
  useFooter?: boolean;
}

const OpinionCardSkeleton: React.FC<OpinionCardSkeletonProps> = (props) => {
  const { useFullWidth, useFooter } = props;

  const cardClassName = useFullWidth
    ? "h-50 p-2.5 my-2 w-full"
    : "h-50 p-2.5 m-2 w-72"; // Remember to change parent width if you change card width from w-72.

  return (
    <Card className={cardClassName} isBlurred>
      {!useFooter && (
        <CardHeader className="flex flex-col items-start p-0 pb-2">
          <div className="flex w-full items-start justify-between">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <TimerAndParticipationsSkeleton />
          </div>
        </CardHeader>
      )}
      <CardBody className="gap-2 p-0 py-2 text-sm">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/5 rounded-lg" />
      </CardBody>
      <CardFooter className="flex flex-none flex-col gap-2 p-0 pt-2">
        <div className="flex w-full justify-between gap-2">
          <Skeleton className="h-6 w-12 rounded-lg" />
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-1 w-full rounded-lg" />
        <div className="flex w-full justify-between gap-2 pb-1">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        {useFooter && <TimerAndParticipationsSkeleton showInRow />}
      </CardFooter>
    </Card>
  );
};

export const OpinionCardSkeletons: React.FC<
  { repeat?: number } & OpinionCardSkeletonProps
> = (props) => {
  const { repeat = 3, ...otherProps } = props;
  return (
    <>
      {Array(repeat)
        .fill(1)
        .map((_, index) => (
          <OpinionCardSkeleton {...otherProps} key={index} />
        ))}
    </>
  );
};
