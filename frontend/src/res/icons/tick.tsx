import {
  useAdaptableIconProps,
  type AdaptableIconProps,
} from "~/hooks/useAdaptableIconProps";

export const TickIcon: React.FC<AdaptableIconProps> = (props) => {
  const svgProps = useAdaptableIconProps(props);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      {...svgProps}
    >
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
    </svg>
  );
};
