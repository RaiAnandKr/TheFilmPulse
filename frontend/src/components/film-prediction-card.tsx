import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Link,
  Slider,
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import type { Film } from "../schema/Film";
import { TimerAndParticipations } from "./timer-and-participations";

interface FilmPredictionCardProps {
  film: Film;
}

export const FilmPredictionCard: React.FC<FilmPredictionCardProps> = (
  props,
) => {
  const { title, filmCasts, imgSrc, topPrediction: prediction } = props.film;

  const [hasPredicted, setHasPredicted] = useState(false);

  const onPrediction = useCallback(() => {
    setHasPredicted(true);
  }, []);

  return (
    <div className="p-3">
      <Card isFooterBlurred className="h-[360px] w-full">
        <CardHeader className="absolute z-10 flex-col items-start bg-black/40 backdrop-blur backdrop-saturate-150">
          <h3 className="overflow-hidden text-ellipsis text-nowrap text-xl font-medium text-white/90 ">
            {title}
          </h3>
          <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-bold text-white/60 ">
            {filmCasts}
          </p>
        </CardHeader>
        <Image
          removeWrapper
          alt="Film Poster"
          className="z-0 h-full w-full object-cover"
          src={imgSrc}
        />
        <CardFooter className="absolute bottom-0 z-10 flex flex-col border-t-1 border-default-600 bg-black/40 font-medium dark:border-default-100">
          <div className="flex w-full items-center justify-between pb-2">
            <p className="w-44 overflow-hidden text-ellipsis text-nowrap text-small text-white/90">
              {prediction.title}
            </p>
            <Link href="/pulse" color="warning" className="text-small">
              More &gt;
            </Link>
          </div>

          <Slider
            label="Prediction meter (in Crores)"
            isDisabled={hasPredicted || !!prediction.userPrediction}
            showTooltip
            step={25}
            formatOptions={{
              style: "decimal",
            }}
            maxValue={1000}
            minValue={0}
            marks={[
              {
                value: prediction.meanPrediction,
                label: "Avg",
              },
            ]}
            defaultValue={300}
            value={prediction.userPrediction}
            fillOffset={prediction.meanPrediction}
            className="mb-3 max-w-md flex-auto text-tiny text-white/60"
            classNames={{ value: "text-teal-500 font-bold" }}
            endContent={
              <Button
                variant="solid"
                color="primary"
                className="flex-none font-bold text-white"
                onClick={onPrediction}
              >
                Predict
              </Button>
            }
          />
          <TimerAndParticipations
            endDate={prediction.endDate}
            totalParticipations={prediction.participationCount}
            showInRow
          />
        </CardFooter>
      </Card>
    </div>
  );
};
