import { Skeleton } from "@nextui-org/react";

export const PredictionMeterSkeleton = () => (
  <>
    <div className="flex w-full items-end justify-between gap-2">
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-3/5 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-10 rounded-lg" />
    </div>
    <div className="flex w-full items-center justify-between gap-2">
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-10 w-20 flex-none rounded-lg" />
    </div>
  </>
);
