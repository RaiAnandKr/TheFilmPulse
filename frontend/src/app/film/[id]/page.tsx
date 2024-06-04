import { Chip, Image } from "@nextui-org/react";
import {
  FILMS,
  getFilmInfoFromFilmId,
  getOpinionsFromFilmId,
  getPredictionsFromFilmId,
} from "~/constants/mocks";
import type { Film } from "~/schema/Film";

export default function FilmPage({ params }: { params: { id: string } }) {
  const filmId = params.id;
  const filmInfo = getFilmInfoFromFilmId(filmId);
  const opinions = getOpinionsFromFilmId(filmId);
  const predictions = getPredictionsFromFilmId(filmId);

  if (!filmInfo) {
    return null;
  }

  const { title, filmDesc, filmCasts, filmDirector, releaseDate } = filmInfo;

  return (
    <div className="flex w-full flex-col">
      <FilmVisual film={filmInfo} />
      <div className="p-2">
        <h2 className="overflow-hidden text-ellipsis text-nowrap text-2xl font-bold">
          {title}
        </h2>
        <Chip
          size="sm"
          radius="sm"
          className="my-2"
          color="warning"
          variant="flat"
          classNames={{ content: "font-bold" }}
        >
          Releasing on {releaseDate}
        </Chip>

        <p className="py-2 text-sm">{filmDesc}</p>
        <p className="text-tiny">
          <span className="font-bold">Starring:&nbsp;</span>
          <span className="font-medium">{filmCasts}</span>
        </p>
        <p className="text-tiny">
          <span className="font-bold">Director:&nbsp;</span>
          <span className="font-medium">{filmDirector}</span>
        </p>
      </div>
    </div>
  );
}

const FilmVisual: React.FC<{ film: Film }> = (props) => {
  const { videoSrc, imgSrc } = props.film;
  if (videoSrc) {
    return (
      <iframe
        src={videoSrc}
        allowFullScreen
        frameBorder={0}
        className="h-52 w-full"
      />
    );
  }

  return (
    <div className="flex justify-center bg-black">
      <Image
        alt="Film Poster"
        radius="none"
        className="object-fit z-0 h-52 w-full"
        src={imgSrc}
      />
    </div>
  );
};

export async function generateStaticParams() {
  return FILMS.map((film) => ({
    id: film.filmId,
  }));
}
