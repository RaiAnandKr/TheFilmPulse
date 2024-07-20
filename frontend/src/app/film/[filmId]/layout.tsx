import { Chip } from "@nextui-org/react";
import { PulseTabs } from "~/components/pulse-tabs";
import { getFilms, getFilmInfoFromFilmId } from "~/service/apiUtils";
import { FilmVisual } from "~/components/film-visual";

export default async function FilmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { filmId: string };
}) {
  const filmId = params.filmId;
  const filmInfo = await getFilmInfoFromFilmId(filmId);

  if (!filmInfo) {
    return null;
  }

  const { title, filmDesc, filmCasts, filmDirector, releaseDate } = filmInfo;

  return (
    <div className="flex h-full w-full flex-col">
      <FilmVisual filmId={filmId} />
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
          Releasing {releaseDate}
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

export async function generateStaticParams() {
  const films = await getFilms();
  return films.map((film) => ({
    filmId: film.filmId,
  }));
}
