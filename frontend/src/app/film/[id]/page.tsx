import { FILMS } from "~/constants/mocks";

export default function FilmPage({ params }: { params: { id: string } }) {
  return <>FilmPage {params.id} </>;
}

export async function generateStaticParams() {
  return FILMS.map((film) => ({
    id: film.filmId,
  }));
}
