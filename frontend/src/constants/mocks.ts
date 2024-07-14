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
import type { Coin } from "~/schema/Coin";
import type { Reward } from "~/schema/Reward";

import type { CouponCode, CouponDetail } from "~/schema/CouponDetail";

const OPINIONS: Opinion[] = [
  {
    type: PulseType.Opinion,
    opinionId: "1",
    title:
      "Will Kalki cross Jawaan's first day box office collection of Rs. 75 Crore in India?",
    endDate: "August 15, 2024",
    filmId: "1",
    votes: [
      { option: OpinionOption.Yes, participationCount: 250, coins: 8235 },
      { option: OpinionOption.No, participationCount: 129, coins: 3875 },
    ],
    userVote: { selectedOption: OpinionOption.Yes, coinsUsed: 25 },
  },
  {
    type: PulseType.Opinion,
    opinionId: "2",
    title: "Will Puspa 2 include cameo from Lord Bobby?",
    endDate: "July 17, 2024",
    filmId: "2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 214, coins: 4230 },
      { option: OpinionOption.No, participationCount: 180, coins: 3975 },
    ],
    userVote: { selectedOption: OpinionOption.No, coinsUsed: 12 },
  },
  {
    type: PulseType.Opinion,
    opinionId: "3",
    title: "Will there be sequel of Pushpa 2?",
    endDate: "July 15, 2024",
    filmId: "2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 68, coins: 2230 },
      { option: OpinionOption.No, participationCount: 126, coins: 2955 },
    ],
  },
  {
    type: PulseType.Opinion,
    opinionId: "4",
    title: "Will there be sequel of Kalki?",
    endDate: "June 15, 2024",
    filmId: "1",
    votes: [
      { option: OpinionOption.Yes, participationCount: 168, coins: 2430 },
      { option: OpinionOption.No, participationCount: 196, coins: 3455 },
    ],
    userVote: { selectedOption: OpinionOption.No, coinsUsed: 12 },
    result: {
      type: PulseResultType.Lost,
      coinsUsed: 12,
      coinsResult: 12,
      finalValue: OpinionOption.Yes,
    },
  },
  {
    type: PulseType.Opinion,
    opinionId: "5",
    title: "Will Fahad Fasil die in Pushpa 2?",
    endDate: "June 2, 2024",
    filmId: "2",
    votes: [
      { option: OpinionOption.Yes, participationCount: 75, coins: 1230 },
      { option: OpinionOption.No, participationCount: 128, coins: 1995 },
    ],
    userVote: { selectedOption: OpinionOption.Yes, coinsUsed: 85 },
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
    predictionId: "1",
    title: "Week 1 box office collection",
    filmId: "1",
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
    predictionId: "2",
    title: "Week 1 IMDB rating",
    filmId: "1",
    endDate: "June 15, 2024",
    participationCount: 4786,
    meanPrediction: 8.2,
    userPrediction: 8.5,
    predictionRange: [0, 10],
    predictionStepValue: 0.1,
  },
  {
    type: PulseType.Prediction,
    predictionId: "3",
    title: "Lifetime collection", // Needs clear naming
    filmId: "1",
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
      ranking: 1500,
    },
  },
  {
    type: PulseType.Prediction,
    predictionId: "4",
    title: "Week 1 box office collection",
    filmId: "2",
    endDate: "July 12, 2024",
    meanPrediction: 750,
    participationCount: 6783,
    predictionRange: [0, 1000],
    predictionStepValue: 25,
    predictionScaleUnit: "Crores",
  },
  {
    type: PulseType.Prediction,
    predictionId: "5",
    title: "Week 1 IMDB rating",
    filmId: "2",
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
      ranking: 21,
    },
  },
  {
    type: PulseType.Prediction,
    predictionId: "6",
    title: "Lifetime collection (including overseas, theaters, OTT)",
    filmId: "2",
    endDate: "July 12, 2024",
    meanPrediction: 2100,
    participationCount: 8929,
    predictionRange: [0, 3000],
    predictionStepValue: 50,
    predictionScaleUnit: "Crores",
  },
];

const FILMS: Film[] = [
  {
    filmId: "1",
    title: "Kalki",
    videoSrc: "https://www.youtube.com/embed/bC36d8e3bb0",
    imgSrc: Kalki.src,
    filmCasts: "Prabhas, Deepika, Kamal and others.",
    filmDirector: "Nag Ashwin",
    filmDesc:
      "Kalki 2898 AD is an upcoming Indian epic science fiction action film, shot primarily in Telugu with some scenes reshot in Hindi. Inspired by Hindu scriptures, the film is set in a post-apocalyptic world, in the year 2898 AD. ",
    releaseDate: "June 15",
    topPrediction: PREDICTIONS.find(
      (prediction) => prediction.predictionId === "1",
    )!,
    predictionIds: ["1", "2", "3"],
  },
  {
    filmId: "2",
    title: "Pushpa 2",
    videoSrc: "https://www.youtube.com/embed/aj0TXpTgbUM",
    imgSrc: Pushpa2.src,
    filmCasts: "Allu, Rashmika, Fahadh and others.",
    filmDirector: "Sukumar",
    filmDesc:
      "Pushpa 2: The Rule, is an upcoming Indian Telugu-language action drama film produced by Naveen Yerneni and Yalamanchili Ravi Shankar under their Mythri Movie Makers banner. It is the second installment in the Pushpa film series and the sequel to Pushpa: The Rise.",
    releaseDate: "July 12",
    topPrediction: PREDICTIONS.find(
      (prediction) => prediction.predictionId === "6",
    )!,
    predictionIds: ["4", "5", "6"],
  },
];

function isPulseActive(endDate: string) {
  return differenceInDays(new Date(), new Date(endDate)) > 0;
}

const getOpinions = async ({
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

const getPredictions = async ({ isActive }: { isActive: boolean }) => {
  const predictions = [...PREDICTIONS];

  return predictions
    .filter((prediction) => isActive === isPulseActive(prediction.endDate))
    .filter(Boolean);
};

const getFilmInfoFromFilmId = (filmId: string) => {
  return FILMS.find((film) => film.filmId === filmId);
};

const getOpinionsFromFilmId = async (filmId: string) => {
  return OPINIONS.filter((opinion) => opinion.filmId === filmId);
};

const getPredictionsFromFilmId = async (filmId: string) => {
  return PREDICTIONS.filter((prediction) => prediction.filmId === filmId);
};

const getPastParticipations = async (): Promise<(Opinion | Prediction)[]> => {
  return [
    ...(await getOpinions({ isActive: false })),
    ...(await getPredictions({ isActive: false })),
  ].filter(
    (pulse) =>
      !!(
        ((pulse as Opinion).userVote ?? (pulse as Prediction).userPrediction) &&
        pulse.result
      ),
  );
};

const REWARDS: Reward[] = [
  {
    checkpoint: 200,
    coupons: [
      {
        couponId: "1",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 50% Cashback Up To Rs 200 on PVR tickets. T&C apply.",
        couponBrandName: "PVR",
        worthCoins: 200,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for booking movie tickets on official PVR app and web.",
          "This Coupon is only applicable for PVR cinemas",
        ],
      },
      {
        couponId: "2",
        couponLogoSrc: Hotstar.src,
        couponInfo:
          "Watch ICC T20 World Cup Cricket Matches For Free On Hotstar. T&C apply.",
        couponBrandName: "Hotstar",
        worthCoins: 200,
        couponExpiryDate: "July 20, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Hotstar app only.",
        ],
      },
    ],
  },
  {
    checkpoint: 400,
    coupons: [
      {
        couponId: "3",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 649. T&C apply.",
        couponBrandName: "Netflix",
        worthCoins: 400,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Netflix app only.",
        ],
      },
      {
        couponId: "4",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 299. T&C apply.",
        couponBrandName: "Amazon Prime Video",
        worthCoins: 400,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Amazon app only.",
        ],
      },
    ],
  },
  {
    checkpoint: 600,
    coupons: [
      {
        couponId: "5",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 300 on PVR tickets. T&C apply.",
        couponBrandName: "PVR",
        worthCoins: 600,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for booking movie tickets on official PVR app and web.",
          "This Coupon is only applicable for PVR cinemas",
        ],
      },
      {
        couponId: "6",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 449. T&C apply.",
        couponBrandName: "Netflix",
        worthCoins: 600,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Netflix app only.",
        ],
      },
      {
        couponId: "7",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 199. T&C apply.",
        couponBrandName: "Amazon Prime Video",
        worthCoins: 600,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Prime Video app only.",
        ],
      },
    ],
  },
  {
    checkpoint: 800,
    coupons: [
      {
        couponId: "8",
        couponLogoSrc: Imax.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 500 on IMAX 3D tickets. T&C apply.",
        couponBrandName: "IMAX 3D",
        worthCoins: 800,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Paytm app only.",
        ],
      },
      {
        couponId: "9",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 349. T&C apply.",
        couponBrandName: "Netflix",
        worthCoins: 800,
        couponExpiryDate: "July 25, 2024",
      },
      {
        couponId: "10",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan starts At Rs 99. T&C apply.",
        couponBrandName: "Amazon Prime Video",
        worthCoins: 800,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Amazon app only.",
        ],
      },
    ],
  },
  {
    checkpoint: 1000,
    coupons: [
      {
        couponId: "11",
        couponLogoSrc: Pvr.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 400 on PVR tickets. T&C apply.",
        couponBrandName: "PVR",
        worthCoins: 1000,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for booking movie tickets on official PVR app and web.",
          "This Coupon is only applicable for PVR cinemas",
        ],
      },
      {
        couponId: "12",
        couponLogoSrc: Imax.src,
        couponInfo:
          "Get Flat 60% Cashback Up To Rs 600 on IMAX 3D tickets. T&C apply.",
        couponBrandName: "IMAX 3D",
        worthCoins: 1000,
        couponExpiryDate: "July 25, 2024",
      },
      {
        couponId: "13",
        couponLogoSrc: Netflix.src,
        couponInfo:
          "Netflix Premium Subscriptions starting At Rs 299. T&C apply.",
        couponBrandName: "Netflix",
        worthCoins: 1000,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Netflix app only.",
        ],
      },
      {
        couponId: "14",
        couponLogoSrc: PrimeVideo.src,
        couponInfo:
          "Amazon Prime Subscription Plan free for 1 year. T&C apply.",
        couponBrandName: "Amazon Prime Video",
        worthCoins: 1000,
        couponExpiryDate: "July 25, 2024",
        couponTnCs: [
          "This Coupon is only applicable for buying subscription from Amazon app only.",
        ],
      },
    ],
  },
];

const getRewards = async () => REWARDS;

const USER_COINS: Coin[] = [
  {
    type: CoinType.Earned,
    coins: 4075,
    isRedeemable: true,
  },
  {
    type: CoinType.Bonus,
    coins: 50,
    isRedeemable: false,
  },
];

const getUserCoins = async (): Promise<Coin[]> => USER_COINS;

const getCouponCode = async (couponId: string): Promise<CouponCode> => {
  return {
    codeId: "xyz",
    code: "STEALDEAL50",
    expiryDate: "July 25, 2024",
  };
};

const getFilms = async () => FILMS;

const postUserOpinion = async (
  opinionId: Opinion["opinionId"],
  coins: string | number,
  option: OpinionOption | undefined,
) => {
  console.log(opinionId, coins, option);
};

const postUserPrediction = async (
  predictionId: Prediction["predictionId"],
  predictionVal: number,
) => {
  console.log(predictionId, predictionVal);
};

const getClaimedCoupons = async (): Promise<
  {
    couponId: CouponDetail["couponId"];
    couponCodes: CouponCode[];
  }[]
> => {
  return [
    {
      couponId: "1",
      couponCodes: [
        getRandomCouponCode("20HEIDNI34G"),
        getRandomCouponCode(30),
      ],
    },
    {
      couponId: "3",
      couponCodes: [
        getRandomCouponCode("20HEIDNI34G"),
        getRandomCouponCode(50),
      ],
    },
    {
      couponId: "6",
      couponCodes: [getRandomCouponCode(10)],
    },
    {
      couponId: "7",
      couponCodes: [
        getRandomCouponCode("20HEIDNI34G"),
        getRandomCouponCode(80),
      ],
    },
    {
      couponId: "12",
      couponCodes: [getRandomCouponCode(50)],
    },
  ];
};

const getRandomCouponCode = (seed: number | string) => {
  return {
    codeId: seed.toString(),
    code: "STEALDEAL" + seed.toString(),
    expiryDate: "July 25, 2024",
  };
};

export {
  getOpinions,
  getFilms,
  getPredictions,
  getFilmInfoFromFilmId,
  getOpinionsFromFilmId,
  getPredictionsFromFilmId,
  getRewards,
  getUserCoins,
  getPastParticipations,
  getCouponCode,
  getClaimedCoupons,
  postUserOpinion,
  postUserPrediction,
};
