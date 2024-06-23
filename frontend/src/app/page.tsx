"use client";

import { OpinionCard } from "../components/opinion-card";
import { FilmPredictionCard } from "../components/film-prediction-card";
import { getFilms, getOpinions } from "../constants/mocks";
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

  useLoadData(
    "trendingOptions",
    () => getOpinions({ isActive: true, limit: 3 }),
    setTrendingOpinions,
  );

  return (
    <>
      <SectionHeader
        title="Trending Opinions"
        onViewAllClick={() => router.push("/pulse")}
        info={
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
          </div>
        }
      />
      <div className="w-full overflow-x-auto">
        <div
          className="bg-success-to-danger flex min-w-full"
          style={{ width: `calc(18rem * ${trendingOpinions.length || 1})` }} // 18rem is for w-72, which is card width
        >
          {trendingOpinions.map((opinion) => (
            <OpinionCard opinion={opinion} key={opinion.opinionId} />
          ))}
        </div>
      </div>
    </>
  );
};

const TrendingFilms = () => {
  const { films, setFilms } = useMainStore((state) => ({
    films: filterMapValuesInArray(state.films, Boolean),
    setFilms: state.setFilms,
  }));
  useLoadData("films", getFilms, setFilms);

  return (
    <>
      <SectionHeader title="Trending Films" />
      {films.map((film) => (
        <FilmPredictionCard key={film.filmId} film={film} />
      ))}
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
