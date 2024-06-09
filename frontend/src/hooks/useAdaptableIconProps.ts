export interface AdaptableIconProps {
  dynamicSize?: boolean;
}

export const useAdaptableIconProps = (props: AdaptableIconProps) => {
  const svgProps = {
    height: props.dynamicSize ? "1em" : "24px",
    width: props.dynamicSize ? "1em" : "24px",
    fill: "currentColor",
  };

  return svgProps;
};
