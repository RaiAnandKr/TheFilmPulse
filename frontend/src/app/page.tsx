"use client";

import { OpinionCard } from "../components/opinion-card";
import { FilmPredictionCard } from "../components/film-prediction-card";
import { getOpinions } from "../service/apiUtils";
import { colors } from "../styles/colors";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "~/res/icons/info";
import { ForwardIcon } from "~/res/icons/forward";
import { useLoadData } from "~/data/hooks/useLoadData";
import { useMainStore } from "~/data/contexts/store-context";
import { filterMapValuesInArray } from "~/utilities/filterMapValuesInArray";
import { useLoadFilmData } from "~/data/hooks/useLoadFilmData";
import { FilmPredictionCardSkeletons } from "~/components/film-prediction-card-skeleton";
import { OpinionCardSkeletons } from "~/components/opinion-card-skeleton";

export default function Page() {
  return (
    <>
      <TrendingOpinions />
      <TrendingFilms />
    </>
  );
}

const TrendingOpinions = () => {
  const router = useRouter();

  const { trendingOpinions, setTrendingOpinions } = useMainStore((state) => ({
    trendingOpinions: filterMapValuesInArray(
      state.opinions,
      (_, opinion) => !!opinion.isTrending,
    ),
    setTrendingOpinions: state.setTrendingOpinions,
  }));

  const { isLoading } = useLoadData(
    "trendingOptions",
    () => getOpinions({ isActive: true, limit: 10 }),
    setTrendingOpinions,
  );

  const numberOfOpinions = isLoading ? 3 : trendingOpinions.length || 1;

  return (
    <>
      <SectionHeader
        title="Trending Opinions"
        onViewAllClick={() => router.push("/pulse")}
        info={
          <div className="px-1 py-2">
            <div className="text-small font-bold">Trade & Win</div>
            <div className="text-tiny">
              Trade with your opinion and instinct around films. <br />
              Respond with &apos;Yes&apos; or &apos;No&apos; and put your coins
              at stake. <br />
              Analyze if the odds favor &apos;Yes&apos; or &apos;No&apos; and
              choose coins. <br />
              Win coins if your opinion is right.
            </div>
          </div>
        }
      />
      <div className="w-full overflow-x-auto">
        <div
          className="bg-success-to-danger flex min-w-full"
          style={{ width: `calc(18rem * ${numberOfOpinions})` }} // 18rem is for w-72, which is card width
        >
          {isLoading ? (
            <OpinionCardSkeletons repeat={numberOfOpinions} />
          ) : (
            trendingOpinions.map((opinion) => (
              <OpinionCard opinion={opinion} key={opinion.opinionId} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

const TrendingFilms = () => {
  const films = useMainStore((state) =>
    filterMapValuesInArray(state.films, Boolean),
  );

  const { isLoading } = useLoadFilmData();

  return (
    <>
      <SectionHeader title="Trending Films" />
      {isLoading ? (
        <FilmPredictionCardSkeletons repeat={2} />
      ) : (
        films.map((film) => (
          <FilmPredictionCard key={film.filmId} film={film} />
        ))
      )}
    </>
  );
};

interface SectionHeaderProps {
  title: string;
  onViewAllClick?: () => void;
  info?: JSX.Element;
}
const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const { title, onViewAllClick, info } = props;
  return (
    <div
      className="flex h-10 items-center justify-between"
      style={{ color: colors.primary }}
    >
      {info ? (
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button
              variant="light"
              color="primary"
              className="text-md h-full font-bold"
              endContent={<InfoIcon />}
            >
              {title}
            </Button>
          </PopoverTrigger>
          <PopoverContent>{info}</PopoverContent>
        </Popover>
      ) : (
        <div className="flex h-full items-center px-4 font-bold">
          <h2>{title}</h2>
        </div>
      )}
      {!!onViewAllClick && (
        <Button
          isIconOnly
          color="primary"
          variant="light"
          onClick={onViewAllClick}
          className="h-full"
        >
          <ForwardIcon />
        </Button>
      )}
    </div>
  );
};
