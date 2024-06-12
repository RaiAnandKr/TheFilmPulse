import type { Film } from "../schema/Film";
import type { Prediction } from "~/schema/Prediction";
import { type Opinion } from "../schema/Opinion";
import { OpinionOption } from "~/schema/OpinionOption";
import Kalki from "../res/images/Kalki.jpeg";
import Pushpa2 from "../res/images/Pushpa2.jpg";
import { differenceInDays } from "~/utilities/differenceInDays";
import { PulseType } from "~/schema/PulseType";
import { PulseResultType } from "~/schema/PulseResult";
import Pvr from "~/res/images/PVR.png";
import Netflix from "~/res/images/Netflix.png";
import PrimeVideo from "~/res/images/PrimeVideo.webp";
import Hotstar from "~/res/images/Hotstar.png";
import Imax from "~/res/images/Imax.png";
import { CoinType } from "~/schema/CoinType";

const OPINIONS: Opinion[] = [
  {
    type: PulseType.Opinion,
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
    type: PulseType.Opinion,
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
    type: PulseType.Opinion,
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
    type: PulseType.Opinion,
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
    filmPosterSrc: Kalki.src,
    result: {
      type: PulseResultType.Lost,
      coinsUsed: 12,
      coinsResult: 12,
      finalValue: OpinionOption.Yes,
    },
  },
  {
    type: PulseType.Opinion,
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
    result: {
      type: PulseResultType.Won,
      coinsUsed: 85,
      coinsResult: 135,
      finalValue: OpinionOption.Yes,
    },
  },
];

const PREDICTIONS: Prediction[] = [
  {
    type: PulseType.Prediction,
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
    type: PulseType.Prediction,
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
    type: PulseType.Prediction,
    predictionId: "film-1-prediction-3",
    title: "Lifetime collection", // Needs clear naming
    filmId: "film-1",
    startDate: "May 26, 2024",
    endDate: "June 1, 2024",
    meanPrediction: 1250,
    userPrediction: 1950,
    participationCount: 1708,
    predictionRange: [0, 3000],
    predictionStepValue: 50,
    predictionScaleUnit: "Crores",
    result: {
      type: PulseResultType.None,
      coinsResult: 0,
      finalValue: 2400,
    },
  },
  {
    type: PulseType.Prediction,
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
    type: PulseType.Prediction,
    predictionId: "film-2-prediction-2",
    title: "Week 1 IMDB rating",
    filmId: "film-2",
    startDate: "May 20, 2024",
    endDate: "June 4, 2024",
    userPrediction: 8.0,
    participationCount: 4786,
    meanPrediction: 8.8,
    predictionRange: [0, 10],
    predictionStepValue: 0.1,
    result: {
      type: PulseResultType.Won,
      coinsResult: 120,
      finalValue: 8.1,
    },
  },
  {
    type: PulseType.Prediction,
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
      type: PulseType.Prediction,
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
      type: PulseType.Prediction,
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

  return opinions
    .filter((opinion) => isActive === isPulseActive(opinion.endDate))
    .slice(0, limit)
    .filter(Boolean);
};

const getPredictions = ({ isActive }: { isActive: boolean }) => {
  const predictions = [...PREDICTIONS];

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

const REWARDS = [
  {
    checkpoint: 200,
    coupons: [
      {
        id: "coupon-1",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 50% Cashback Up To Rs 200 on PVR tickets. T&C apply.",
      },
      {
        id: "coupon-2",
        couponLogoSrc: Hotstar.src,
        couponInfo:
          "Watch ICC T20 World Cup Cricket Matches For Free On Hotstar. T&C apply.",
      },
    ],
  },
  {
    checkpoint: 400,
    coupons: [
      {
        id: "coupon-3",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 649. T&C apply.",
      },
      {
        id: "coupon-4",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 299. T&C apply.",
      },
    ],
  },
  {
    checkpoint: 600,
    coupons: [
      {
        id: "coupon-5",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 300 on PVR tickets. T&C apply.",
      },
      {
        id: "coupon-6",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 449. T&C apply.",
      },
      {
        id: "coupon-7",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 199. T&C apply.",
      },
    ],
  },
  {
    checkpoint: 800,
    coupons: [
      {
        id: "coupon-8",
        couponLogoSrc: Imax.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 500 on IMAX 3D tickets. T&C apply.",
      },
      {
        id: "coupon-9",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 349. T&C apply.",
      },
      {
        id: "coupon-10",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 99. T&C apply.",
      },
    ],
  },
  {
    checkpoint: 1000,
    coupons: [
      {
        id: "coupon-11",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 400 on PVR tickets. T&C apply.",
      },
      {
        id: "coupon-12",
        couponLogoSrc: Imax.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 600 on IMAX 3D tickets. T&C apply.",
      },
      {
        id: "coupon-13",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 299. T&C apply.",
      },
      {
        id: "coupon-14",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan free for 1 year. T&C apply.",
      },
    ],
  },
];

const USER_COINS = [
  {
    type: CoinType.Bonus,
    coins: 50,
  },
  { type: CoinType.Earned, coins: 450 },
];

export {
  getOpinions,
  FILMS,
  getFilmInfo,
  getPredictions,
  getFilmInfoFromFilmId,
  getOpinionsFromFilmId,
  getPredictionsFromFilmId,
  REWARDS,
  USER_COINS,
};
