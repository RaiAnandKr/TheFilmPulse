import { GroupIcon } from "../res/icons/group";
import { differenceInDays } from "../utilities/differenceInDays";
import { numberInShorthand } from "../utilities/numberInShorthand";

export const TimerAndParticipations: React.FC<{
  endDate: string;
  totalParticipations: number;
  showInRow?: boolean;
}> = (props) => {
  const { endDate, totalParticipations, showInRow } = props;
  const effectiveClassName = showInRow
    ? "flex h-full w-full items-end justify-between px-2"
    : "flex h-full flex-col items-end px-2";
  return (
    <div className={effectiveClassName}>
      <EndTimer endDate={endDate} />
      <TotalParticipations totalParticipations={totalParticipations} />
    </div>
  );
};

export const EndTimer: React.FC<{ endDate: string }> = (props) => {
  const daysToEnd = differenceInDays(new Date(), new Date(props.endDate));
  const isEndDateInPast = daysToEnd < 0;

  return (
    <p className="text-xs text-default-400">
      <span className="font-semibold">
        {isEndDateInPast ? "Ended on: " : "Ends in: "}
      </span>
      <span>{isEndDateInPast ? props.endDate : `${daysToEnd} days`}</span>
    </p>
  );
};

export const TotalParticipations: React.FC<{ totalParticipations: number }> = (
  props,
) => (
  <p className="flex h-full items-end text-nowrap text-small text-default-400">
    <span>
      <GroupIcon />
    </span>
    <span> &nbsp; {numberInShorthand(props.totalParticipations)} </span>
  </p>
);
