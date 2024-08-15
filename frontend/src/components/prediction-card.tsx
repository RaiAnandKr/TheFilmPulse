import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { TimerAndParticipations } from "./timer-and-participations";
import { PredictionMeter } from "./prediction-meter";
import { ResultChip } from "./result-chip";
import { TrophyIcon } from "~/res/icons/trophy";
import { numberInShorthand } from "~/utilities/numberInShorthand";
import { useMainStore } from "~/data/contexts/store-context";
import { isValidPrediction } from "~/utilities/isValidPrediction";
import { FilmHeader } from "./film-header";
import type { Prediction } from "~/schema/Prediction";
import type { MainStore } from "~/data/store/main-store";

interface PredictionCardProps {
  prediction: Prediction;
  noHeader?: boolean;
  showResult?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = (props) => {
  const { prediction, noHeader, showResult } = props;
  const film = useMainStore((state) =>
    predictionFilmSelector(state, prediction.predictionId),
  );

  if (!film) {
    return null;
  }

  return (
    <Card className="h-50 my-2 w-full p-3" isBlurred>
      {showResult && <PredictionResult {...prediction} />}
      {!noHeader && (
        <CardHeader className="flex flex-col items-start p-0 pb-2 bg-success-100 bg-opacity-75">
          <FilmHeader filmId={film.filmId} appendNavigationPath="contests" />
        </CardHeader>
      )}
      <CardBody className="flex flex-col p-0 py-2">
        {showResult ? (
          <PredictionDiff {...prediction} />
        ) : (
          <PredictionMeter prediction={prediction} />
        )}
      </CardBody>
      <CardFooter className="justify-center p-0">
        <TimerAndParticipations
          endDate={prediction.endDate}
          totalParticipations={prediction.participationCount}
          showInRow
        />
      </CardFooter>
    </Card>
  );
};

const PredictionDiff: React.FC<
  Pick<
    Prediction,
    "userPrediction" | "result" | "predictionScaleUnit" | "title"
  >
> = (props) => {
  const { userPrediction, result, predictionScaleUnit, title } = props;
  const isValidUserPrediction = isValidPrediction(userPrediction);
  if (!isValidUserPrediction) {
    return <p className="text-sm text-default-500">No participation!</p>;
  }

  return (
    <div className="flex flex-col pt-2 text-sm">
      <p className="my-2 font-medium">{title}</p>
      <div className="flex justify-between text-primary">
        <span>Actual result :</span>
        {result ? (
          <span>
            {result.finalValue ?? 0} {predictionScaleUnit ?? ""}
          </span>
        ) : (
          <span className="text-warning">Pending</span>
        )}
      </div>
      <div className="flex justify-between text-default-500">
        <span>Your prediction :</span>
        <span>
          {userPrediction} {predictionScaleUnit}
        </span>
      </div>
    </div>
  );
};

const PredictionResult: React.FC<
  Pick<Prediction, "userPrediction" | "result">
> = (props) => {
  const { userPrediction, result } = props;
  return (
    <div className="flex w-full items-center justify-between">
      <ResultChip hasUserParticipated={!!userPrediction} result={result} />
      {!!result?.ranking && (
        <div className="mb-2 flex items-center text-sm font-bold text-primary">
          <TrophyIcon />
          <span className="mx-1">Rank {numberInShorthand(result.ranking)}</span>
        </div>
      )}
    </div>
  );
};

const predictionFilmSelector = (state: MainStore, predictionId: string) => {
  const associatedFilmId = state.predictions.get(predictionId)?.filmId;
  if (!associatedFilmId) {
    return null;
  }

  const associatedFilm = state.films.get(associatedFilmId);
  return associatedFilm;
};
