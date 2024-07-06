import {
  useAdaptableIconProps,
  type AdaptableIconProps,
} from "~/hooks/useAdaptableIconProps";

export const CloseIcon: React.FC<AdaptableIconProps> = (props) => {
  const svgProps = useAdaptableIconProps(props);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      {...svgProps}
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
};
