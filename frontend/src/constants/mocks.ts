import type { Film } from "../schema/Film";
import type { Prediction } from "~/schema/Prediction";
import { OpinionOption, type Opinion } from "../schema/Opinion";
import Kalki from "../res/images/Kalki.jpeg";
import Pushpa2 from "../res/images/Pushpa2.jpg";
import { differenceInDays } from "~/utilities/differenceInDays";

const OPINIONS: Opinion[] = [
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
    filmPosterSrc: Kalki.src,
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
    filmPosterSrc: Pushpa2.src,
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
    filmPosterSrc: Pushpa2.src,
  },
  {
    opinionId: "d",
    title: "Will there be sequel of Kalki?",
    startDate: "May 25, 2024",
    endDate: "June 5, 2024",
    filmId: "film-1",
    votes: [
      { option: OpinionOption.Yes, participationCount: 168, coins: 2430 },
      { option: OpinionOption.No, participationCount: 196, coins: 3455 },
    ],
    userVote: { selectedOption: OpinionOption.No, coinsUsed: 12 },
    filmPosterSrc: Pushpa2.src,
  },
  {
    opinionId: "e",
    title: "Will Fahad Fasil die in Pushpa 2?",
    startDate: "May 25, 2024",
    endDate: "June 2, 2024",
    filmId: "film-2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 75, coins: 1230 },
      { option: OpinionOption.No, participationCount: 128, coins: 1995 },
    ],
    userVote: { selectedOption: OpinionOption.Yes, coinsUsed: 85 },
    filmPosterSrc: Pushpa2.src,
  },
];

const PREDICTIONS: Prediction[] = [
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
    predictionRange: [0, 3000],
    predictionStepValue: 50,
    predictionScaleUnit: "Crores",
  },
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
    userPrediction: 1450,
    participationCount: 8929,
    predictionRange: [0, 3000],
    predictionStepValue: 50,
    predictionScaleUnit: "Crores",
  },
];

const FILMS: Film[] = [
  {
    filmId: "film-1",
    title: "Kalki",
    videoSrc: "https://www.youtube.com/embed/bC36d8e3bb0",
    imgSrc: Kalki.src,
    filmCasts: "Prabhas, Deepika, Kamal and others.",
    filmDirector: "Nag Ashwin",
    filmDesc:
      "Kalki 2898 AD is an upcoming Indian epic science fiction action film, shot primarily in Telugu with some scenes reshot in Hindi. Inspired by Hindu scriptures, the film is set in a post-apocalyptic world, in the year 2898 AD. ",
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
    predictionIds: [
      "film-1-prediction-1",
      "film-1-prediction-1",
      "film-1-prediction-1",
    ],
  },
  {
    filmId: "film-2",
    title: "Pushpa 2",
    videoSrc: "https://www.youtube.com/embed/aj0TXpTgbUM",
    imgSrc: Pushpa2.src,
    filmCasts: "Allu, Rashmika, Fahadh and others.",
    filmDirector: "Sukumar",
    filmDesc:
      "Pushpa 2: The Rule, is an upcoming Indian Telugu-language action drama film produced by Naveen Yerneni and Yalamanchili Ravi Shankar under their Mythri Movie Makers banner. It is the second installment in the Pushpa film series and the sequel to Pushpa: The Rise.",
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
    predictionIds: [
      "film-2-prediction-1",
      "film-2-prediction-1",
      "film-2-prediction-1",
    ],
  },
];

const getFilmInfo = (predictionId: string) => {
  return FILMS.find(
    (film) =>
      film.filmId ===
      PREDICTIONS.find((prediction) => prediction.predictionId === predictionId)
        ?.filmId,
  );
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

function isPulseActive(endDate: string) {
  return differenceInDays(new Date(), new Date(endDate)) > 0;
}

const getOpinions = ({
  isActive,
  limit,
}: {
  isActive: boolean;
  limit?: number;
}) => {
  const opinions = [...OPINIONS];

  shuffle(opinions);

  return opinions
    .filter((opinion) => isActive === isPulseActive(opinion.endDate))
    .slice(0, limit)
    .filter(Boolean);
};

const getPredictions = ({ isActive }: { isActive: boolean }) => {
  const predictions = [...PREDICTIONS];

  shuffle(predictions);

  return predictions
    .filter((prediction) => isActive === isPulseActive(prediction.endDate))
    .filter(Boolean);
};

const getFilmInfoFromFilmId = (filmId: string) => {
  return FILMS.find((film) => film.filmId === filmId);
};

const getOpinionsFromFilmId = (filmId: string) => {
  return OPINIONS.filter((opinion) => opinion.filmId === filmId);
};

const getPredictionsFromFilmId = (filmId: string) => {
  return PREDICTIONS.filter((prediction) => prediction.filmId === filmId);
};

export {
  getOpinions,
  FILMS,
  getFilmInfo,
  getPredictions,
  getFilmInfoFromFilmId,
  getOpinionsFromFilmId,
  getPredictionsFromFilmId,
};
