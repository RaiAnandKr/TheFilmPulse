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
      <TrendingContests />
      <TrendingFilms />
    </>
  );
}

const TrendingContests = () => {
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
        title="Trending Contests"
        onViewAllClick={() => router.push("/contests")}
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
