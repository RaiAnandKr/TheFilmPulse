import type { ButtonProps } from "@nextui-org/react";

export type MenuItem = {
  key: string;
  label: string;
  btnColor?: ButtonProps["color"];
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  pathName?: string;
};
