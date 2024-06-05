import { Chip, Image } from "@nextui-org/react";
import { PulseTabs } from "~/components/pulse-tabs";
import { FILMS, getFilmInfoFromFilmId } from "~/constants/mocks";
import type { Film } from "~/schema/Film";

export default function FilmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { filmId: string };
}) {
  const filmId = params.filmId;
  const filmInfo = getFilmInfoFromFilmId(filmId);

  if (!filmInfo) {
    return null;
  }

  const { title, filmDesc, filmCasts, filmDirector, releaseDate } = filmInfo;

  return (
    <div className="flex h-full w-full flex-col">
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
      <PulseTabs>{children}</PulseTabs>
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
    filmId: film.filmId,
  }));
}
