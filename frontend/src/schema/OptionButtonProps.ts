import type { Opinion, UserVote, Vote } from "./Opinion";
import type { OpinionOption } from "./OpinionOption";
import type { ClassValue } from "tailwind-variants";

export interface OptionButtonProps {
  opinion: Opinion;
  option: OpinionOption;
  classNames: {
    buttonColor: "success" | "danger";
    contentBgColor: ClassValue;
    contentTextColor: ClassValue;
  };
  icon: JSX.Element;
  onOpinionConfirmed: (userVote: UserVote) => void;
}
