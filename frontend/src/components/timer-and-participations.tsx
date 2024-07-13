import { cn } from "@nextui-org/react";
import { GroupIcon } from "../res/icons/group";
import { differenceInDays } from "../utilities/differenceInDays";
import { numberInShorthand } from "../utilities/numberInShorthand";

export const TimerAndParticipations: React.FC<{
  endDate: string;
  totalParticipations: number;
  showInRow?: boolean;
  isDarkTheme?: boolean;
}> = (props) => {
  const { endDate, totalParticipations, showInRow, isDarkTheme } = props;
  const effectiveClassName = showInRow
    ? "flex h-full w-full items-end justify-between px-2"
    : "flex h-full flex-col items-end px-2";
  return (
    <div className={effectiveClassName}>
      <EndTimer endDate={endDate} isDarkTheme={isDarkTheme} />
      <TotalParticipations
        totalParticipations={totalParticipations}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};

export const EndTimer: React.FC<{
  endDate: string;
  isDarkTheme?: boolean;
}> = (props) => {
  const daysToEnd = differenceInDays(new Date(), new Date(props.endDate));
  const isEndDateInPast = daysToEnd < 0;

  return (
    <p
      className={cn(
        "text-xs",
        props.isDarkTheme ? "text-default-300" : "text-default-400",
      )}
    >
      <span className="font-semibold">
        {isEndDateInPast ? "Ended on: " : "Ends in: "}
      </span>
      <span>{isEndDateInPast ? props.endDate : `${daysToEnd} days`}</span>
    </p>
  );
};

export const TotalParticipations: React.FC<{
  totalParticipations: number;
  isDarkTheme?: boolean;
}> = (props) => (
  <p
    className={cn(
      "flex h-full items-end text-nowrap text-small text-default-300",
      props.isDarkTheme ? "text-default-300" : "text-default-400",
    )}
  >
    <span>
      <GroupIcon />
    </span>
    <span> &nbsp; {numberInShorthand(props.totalParticipations)} </span>
  </p>
);
