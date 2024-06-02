import type { Film, Prediction } from "../schema/Film";
import { OpinionOption, type Opinion } from "../schema/Opinion";
import Kalki from "../res/images/Kalki.jpeg";
import Pushpa2 from "../res/images/Pushpa2.jpg";

const TOP_OPINIONS: Opinion[] = [
  {
    opinionId: "a",
    title:
      "Will Kalki cross Jawaan's first day box office collection of Rs. 75 Crore in India?",
    startDate: "May 26, 2024",
    endDate: "June 15, 2024",
    filmId: "film-1",
    votes: [
      { option: OpinionOption.Yes, participationCount: 250, coins: 8235 },
      { option: OpinionOption.No, participationCount: 129, coins: 3875 },
    ],
    userVote: { selectedOption: OpinionOption.Yes, coinsUsed: 25 },
  },
  {
    opinionId: "b",
    title: "Will Puspa 2 include cameo from Lord Bobby?",
    startDate: "May 20, 2024",
    endDate: "June 17, 2024",
    filmId: "film-2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 214, coins: 4230 },
      { option: OpinionOption.No, participationCount: 180, coins: 3975 },
    ],
    userVote: { selectedOption: OpinionOption.No, coinsUsed: 12 },
  },
  {
    opinionId: "c",
    title: "Will there be sequel of Pushpa 2?",
    startDate: "May 25, 2024",
    endDate: "July 15, 2024",
    filmId: "film-2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 68, coins: 2230 },
      { option: OpinionOption.No, participationCount: 126, coins: 2955 },
    ],
  },
];

const FILMS: Film[] = [
  {
    filmId: "film-1",
    title: "Kalki",
    videoSrc: "<some-video-src>",
    imgSrc: Kalki.src,
    filmCasts: "Prabhas, Deepika, Kamal and others.",
    releaseDate: "June 15",
    topPrediction: {
      predictionId: "film-1-prediction-1",
      title: "Week 1 box office collection",
      filmId: "film-1",
      startDate: "May 26, 2024",
      endDate: "June 15, 2024",
      meanPrediction: 400,
      participationCount: 3748,
      userPrediction: 775,
      predictionRange: [0, 1000],
      predictionStepValue: 25,
      predictionScaleUnit: "Crores",
    },
    predictions: [
      {
        predictionId: "film-1-prediction-1",
        title: "Week 1 box office collection",
        filmId: "film-1",
        startDate: "May 26, 2024",
        endDate: "June 15, 2024",
        participationCount: 3748,
        meanPrediction: 400,
        userPrediction: 775,
        predictionRange: [0, 1000],
        predictionStepValue: 25,
        predictionScaleUnit: "Crores",
      },
      {
        predictionId: "film-1-prediction-2",
        title: "Week 1 IMDB rating",
        filmId: "film-1",
        startDate: "May 26, 2024",
        endDate: "June 15, 2024",
        participationCount: 4786,
        meanPrediction: 8.2,
        userPrediction: 8.5,
        predictionRange: [0, 10],
        predictionStepValue: 0.1,
      },
      {
        predictionId: "film-1-prediction-3",
        title: "Lifetime collection", // Needs clear naming
        filmId: "film-1",
        startDate: "May 26, 2024",
        endDate: "June 15, 2024",
        meanPrediction: 1250,
        participationCount: 1708,
        userPrediction: 1450,
        predictionRange: [0, 3000],
        predictionStepValue: 50,
        predictionScaleUnit: "Crores",
      },
    ],
  },
  {
    filmId: "film-2",
    title: "Pushpa 2",
    videoSrc: "<some-video-src>",
    imgSrc: Pushpa2.src,
    filmCasts: "Allu, Rashmika, Fahadh and others.",
    releaseDate: "July 12",
    topPrediction: {
      predictionId: "film-2-prediction-3",
      title: "Lifetime collection (including overseas, theaters, OTT)",
      filmId: "film-2",
      startDate: "May 20, 2024",
      endDate: "July 12, 2024",
      meanPrediction: 2100,
      participationCount: 8929,
      predictionRange: [0, 3000],
      predictionStepValue: 50,
      predictionScaleUnit: "Crores",
    },
    predictions: [
      {
        predictionId: "film-2-prediction-1",
        title: "Week 1 box office collection",
        filmId: "film-2",
        startDate: "May 20, 2024",
        endDate: "July 12, 2024",
        meanPrediction: 750,
        participationCount: 6783,
        predictionRange: [0, 1000],
        predictionStepValue: 25,
        predictionScaleUnit: "Crores",
      },
      {
        predictionId: "film-2-prediction-2",
        title: "Week 1 IMDB rating",
        filmId: "film-2",
        startDate: "May 20, 2024",
        endDate: "July 12, 2024",
        participationCount: 4786,
        meanPrediction: 8.8,
        predictionRange: [0, 10],
        predictionStepValue: 0.1,
      },
      {
        predictionId: "film-2-prediction-3",
        title: "Lifetime collection (including overseas, theaters, OTT)",
        filmId: "film-2",
        startDate: "May 20, 2024",
        endDate: "July 12, 2024",
        meanPrediction: 2100,
        participationCount: 8929,
        predictionRange: [0, 3000],
        predictionStepValue: 50,
        predictionScaleUnit: "Crores",
      },
    ],
  },
];

const getFilmInfo = (predictionId: string) => {
  return FILMS.find(
    (film) =>
      !!film.predictions?.find(
        (prediction) => prediction.predictionId === predictionId,
      ),
  );
};

const getPredictions = () => {
  const predictions: Prediction[] = [];

  FILMS.forEach((film) => {
    film.predictions && predictions.push(...film.predictions);
  });

  shuffle(predictions);
  return predictions;
};

function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex] as T,
      array[currentIndex] as T,
    ];
  }
}

export { TOP_OPINIONS, FILMS, getFilmInfo, getPredictions };
