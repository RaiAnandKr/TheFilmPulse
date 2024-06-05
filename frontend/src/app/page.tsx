"use client";

import { OpinionCard } from "../components/opinion-card";
import { FilmPredictionCard } from "../components/film-prediction-card";
import { TOP_OPINIONS, FILMS } from "../constants/mocks";
import { colors } from "../styles/colors";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "~/res/icons/info";

export default function Page() {
  return (
    <>
      <TopOpinions />
      <FilmPredictions />
    </>
  );
}

const TopOpinions = () => {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="Top Opinions"
        onViewAllClick={() => router.push("/pulse")}
        infoText=""
      />
      <div className="w-full overflow-x-auto">
        <div
          className="flex bg-gradient-to-r from-green-200 to-rose-200"
          style={{ width: `calc(18rem * ${TOP_OPINIONS.length || 1})` }} // 18rem is for w-72, which is card width
        >
          {TOP_OPINIONS.map((opinion) => (
            <OpinionCard opinion={opinion} key={opinion.opinionId} />
          ))}
        </div>
      </div>
    </>
  );
};

const FilmPredictions = () => {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="Film Predictions"
        onViewAllClick={() => router.push("/pulse/predictions")}
        infoText=""
      />
      {FILMS.map((film) => (
        <FilmPredictionCard key={film.filmId} film={film} />
      ))}
    </>
  );
};

interface SectionHeaderProps {
  title: string;
  infoText: string;
  onViewAllClick: () => void;
}
const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const { title, onViewAllClick } = props;
  return (
    <div
      className="flex h-10 items-center justify-between text-sm"
      style={{ color: colors.primary }}
    >
      <Popover placement="bottom" showArrow={true}>
        <PopoverTrigger>
          <Button
            variant="light"
            color="primary"
            className="h-full font-bold"
            endContent={<InfoIcon />}
          >
            {title}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="light"
        color="primary"
        onClick={onViewAllClick}
        className="h-full"
      >
        View All
      </Button>
    </div>
  );
};
