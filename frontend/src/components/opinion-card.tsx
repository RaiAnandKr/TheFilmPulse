import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";

interface OpinionProps {
  title: string;
  daysToEnd: number;
  options: {
    key: string;
    label: string;
    color: "success" | "danger";
    icon: JSX.Element;
  }[];
}

export const OpinionCard: React.FC<OpinionProps> = (props) => {
  const { title, options, daysToEnd } = props;
  return (
    <Card className="h-50 m-3 w-72">
      <CardBody className="p-3.5 text-base">
        <p>{title}</p>
      </CardBody>
      <CardFooter className="flex flex-none flex-col">
        <p>
          <span className="text-small font-semibold text-default-400">
            Ends in:
          </span>
          <span className=" text-small text-default-400">
            {` ${daysToEnd} days`}
          </span>
        </p>
        <div className="flex w-full justify-evenly pt-2">
          {options.map((option) => (
            <Button
              variant="bordered"
              color={option.color}
              key={option.key}
              startContent={option.icon}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
