import { Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMainStore } from "~/data/contexts/store-context";

export const FilmHeader: React.FC<{
  filmId: string;
  appendNavigationPath?: string;
}> = (props) => {
  const { filmId, appendNavigationPath } = props;

  const film = useMainStore((state) => state.films.get(filmId));
  const router = useRouter();

  if (!film) {
    return null;
  }

  const onFilmPosterClick = () => {
    router.push(`/film/${film.filmId}/${appendNavigationPath ?? ""}`);
  };

  const { title, imgSrc, filmCasts } = film;
  return (
    <div className="flex w-full items-center gap-2 overflow-hidden">
      <Button isIconOnly radius="sm" onClick={onFilmPosterClick} className="mt-2 ml-2">
        <Image
          alt="nextui logo"
          height={48}
          src={
            imgSrc ??
            "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          }
          width={48}
          className="max-h-12 max-w-12"
        />
      </Button>

      <div className="flex flex-col">
        <h3 className="text-md overflow-hidden text-ellipsis text-nowrap font-semibold">
          {title}
        </h3>
        <p className="overflow-hidden text-ellipsis text-nowrap text-tiny font-medium text-default-500">
          {filmCasts}
        </p>
      </div>
    </div>
  );
};
