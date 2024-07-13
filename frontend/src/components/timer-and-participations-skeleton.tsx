import { Skeleton } from "@nextui-org/react";

export const TimerAndParticipationsSkeleton: React.FC<{
  showInRow?: boolean;
}> = (props) => {
  const { showInRow } = props;
  const effectiveClassName = showInRow
    ? "flex h-full w-full items-end justify-between px-2 gap-2"
    : "flex h-full flex-col items-end px-2 gap-2";
  return (
    <div className={effectiveClassName}>
      <Skeleton className="h-3 w-24 rounded-lg" />
      <Skeleton className="h-3 w-12 rounded-lg" />
    </div>
  );
};
