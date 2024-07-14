import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { InfoIcon } from "~/res/icons/info";
import { PulseResultType, type PulseResult } from "~/schema/PulseResult";
import { numberInShorthand } from "~/utilities/numberInShorthand";

interface ResultChipProps {
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
  const { hasUserParticipated, result } = props;

  if (!hasUserParticipated) {
    return null;
  }

  const resultType = result?.type ?? PulseResultType.None;
  const resultText = result
    ? `${numberInShorthand(result.coinsResult)} coins`
    : "Pending result";

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Chip
          size="md"
          radius="sm"
          color={RESULT_COLOR_MAP.get(resultType)}
          variant="flat"
          classNames={{ content: "font-bold" }}
          className="mb-2"
          endContent={<InfoIcon dynamicSize />}
        >
          {resultType}: {resultText}
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
