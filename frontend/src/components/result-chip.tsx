import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { InfoIcon } from "~/res/icons/info";
import { PulseResultType, type PulseResult } from "~/schema/PulseResult";
import { differenceInDays } from "~/utilities/differenceInDays";
import { numberInShorthand } from "~/utilities/numberInShorthand";

interface ResultChipProps {
  endDate: string;
  hasUserParticipated: boolean;
  result?: Pick<PulseResult<undefined>, "type" | "coinsResult">;
}

const RESULT_COLOR_MAP = new Map<
  PulseResultType,
  "success" | "danger" | "warning"
>([
  [PulseResultType.Won, "success"],
  [PulseResultType.Lost, "danger"],
  [PulseResultType.None, "warning"],
]);

export const ResultChip: React.FC<ResultChipProps> = (props) => {
  const { endDate, hasUserParticipated, result } = props;
  const daysToEnd = differenceInDays(new Date(), new Date(endDate));
  const isEndDateInPast = daysToEnd < 0;

  if (!isEndDateInPast || !hasUserParticipated || !result) {
    return null;
  }

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Chip
          size="sm"
          radius="sm"
          color={RESULT_COLOR_MAP.get(result.type)}
          variant="flat"
          classNames={{ content: "font-bold" }}
          className="mb-2"
          endContent={<InfoIcon dynamicSize />}
        >
          {result.type}: {numberInShorthand(result.coinsResult)} coins
        </Chip>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
