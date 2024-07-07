"use client";

import { redirect } from "next/navigation";

const FilmPage = ({ params }: { params: { filmId: string } }) => {
  redirect(`${params.filmId}/opinions`);
};

export default FilmPage;
