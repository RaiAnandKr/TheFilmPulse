"use client";

import { cn, Image, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import { useMainStore } from "~/data/contexts/store-context";

export const FilmVisual: React.FC<{ filmId: string }> = (props) => {
  const { filmId } = props;

  const film = useMainStore((state) => state.films.get(filmId));

  if (!film) {
    return null;
  }

  const { videoSrc, imgSrc } = film;

  if (!videoSrc) {
    <div className="flex justify-center bg-black">
      <Image
        alt="Film Poster"
        radius="none"
        className="object-fit z-0 h-52 w-full"
        src={imgSrc}
      />
    </div>;
  }

  return <LoadingIframe videoSrc={videoSrc!} />;
};

const LoadingIframe: React.FC<{ videoSrc: string }> = (props) => {
  const { videoSrc } = props;
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <>
      {iframeLoading && <Skeleton className="h-52 w-full" />}
      <iframe
        src={videoSrc}
        allowFullScreen
        frameBorder={0}
        className={cn("h-52 w-full", iframeLoading && "hidden")}
        onLoad={() => {
          setIframeLoading(false);
        }}
      />
    </>
  );
};
