import type { UserVote, Vote } from "./Opinion";
import type { OpinionOption } from "./OpinionOption";
import type { ClassValue } from "tailwind-variants";

export interface OptionButtonProps {
  option: OpinionOption;
  classNames: {
    buttonColor: "success" | "danger";
    contentBgColor: ClassValue;
    contentTextColor: ClassValue;
  };
  icon: JSX.Element;
  votes: Vote[];
  onOpinionConfirmed: (userVote: UserVote) => void;
  endDate: string;
  userVote?: UserVote;
}
