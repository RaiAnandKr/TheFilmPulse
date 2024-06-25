/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import fernet from 'fernet';

import type { Film } from "../schema/Film";
import type { Prediction } from "~/schema/Prediction";
import type { Opinion, Vote, UserVote } from "../schema/Opinion";
import { OpinionOption } from "~/schema/OpinionOption";
import { PulseType } from "~/schema/PulseType";
import { CouponDetail, CouponCode } from "~/schema/CouponDetail";
import { PulseResult, PulseResultType } from "~/schema/PulseResult";

const BASE_URL =
  "https://backend.thefilmpulse.com";

interface FetchConfig extends RequestInit {
  headers?: HeadersInit;
}

interface ErrorResponse {
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    // If a custom error message is returned by the backend, use that otherwise use
    // a generic HTTP error message.
    throw new Error(
      errorData.error ?? `HTTP error! status: ${response.status}`,
    );
  }

  const data = (await response.json()) as T; // Explicitly assert the type here
  return data;
};

export const get = async <T>(url: string, config?: FetchConfig): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "include", // Ensure cookies are included
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(config?.headers ?? {}),
    },
  });
  return handleResponse(response);
};

export const post = async <T>(
  url: string,
  body: unknown,
  config?: FetchConfig,
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    credentials: "include", // Ensure cookies are included
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(config?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
};

export const getFilms = async (
  filmId: number | string,
  config?: FetchConfig,
): Promise<Film[]> => {
  try {
    const url = filmId ? `/films?film_id=${filmId}` : "/films";
    const filmsData = await get<any[]>(url, config);

    const films: Film[] = filmsData.map((filmData) => {
      const predictionData = filmData.top_prediction;
      const topPrediction: Prediction = {
        type: PulseType.Prediction,
        predictionId: predictionData.id.toString(),
        title: predictionData.text,
        filmId: predictionData.film_id.toString(),
        participationCount: predictionData.user_count,
        meanPrediction: predictionData.mean_value || 0,
        endDate: predictionData.end_date,
        predictionRange: [predictionData.min_value, predictionData.max_value],
        userPrediction: predictionData.user_vote?.answer || null,
        predictionStepValue: predictionData.step_value || 25,
        predictionScaleUnit: predictionData.unit || "",
        // Adding dummy values to avoid breaking code because of type error.
        startDate: "2024-04-10",
      };

      return {
        filmId: filmData.id.toString(),
        title: filmData.title,
        filmDesc: filmData.summary,
        videoSrc: filmData.trailer_url,
        imgSrc: filmData.poster_url,
        topPrediction: topPrediction,
        releaseDate: filmData.release_date,
        filmCasts: filmData.cast_metadata?.actors.join(", ") || "",
        filmDirector: filmData.cast_metadata?.directors.join(", ") || "",
        // Fetching a film isn't going to return all the prediction IDs (that's too much to ask from the backend).
        // We should separately query the predictions for a film or film_id.
        predictionIds: [topPrediction.predictionId]
      };
    });

    return films;
  } catch (error) {
    throw new Error(`Error fetching films: ${(error as Error).message}`);
  }
};

export const getOpinions = async (
  filmId: number,
  limit: number,
  config?: FetchConfig,
): Promise<Opinion[]> => {
  try {
    let url = "/opinions";
    if (filmId) {
      url += `?film_id=${filmId}`;
    }
    if (limit) {
      url += limit === 0 ? "" : `&limit=${limit}`; // Avoid adding limit=0 as it's unnecessary
    }
    const opinionsData = await get<any[]>(url, config);

    const opinions: Opinion[] = opinionsData.map((opinionData) => {
      const yesVote: Vote = {
        option: OpinionOption.Yes,
        participationCount: opinionData.yes_count,
        coins: opinionData.yes_coins,
      };

      const noVote: Vote = {
        option: OpinionOption.No,
        participationCount: opinionData.no_count,
        coins: opinionData.no_coins,
      };

      const userVote: UserVote | undefined = opinionData.user_vote
        ? {
          selectedOption: opinionData.user_vote.answer === 'yes' ? OpinionOption.Yes
            : (opinionData.user_vote.answer === 'no' ? OpinionOption.No: undefined),
          coinsUsed: opinionData.user_vote.coins,
        }
        : undefined;

      return {
        type: PulseType.Opinion,
        opinionId: opinionData.id.toString(),
        title: opinionData.text,
        endDate: opinionData.end_date,
        filmId: opinionData.film_id.toString(),
        filmPosterSrc: opinionData.icon_url,
        votes: [yesVote, noVote],
        userVote: userVote,
        // Adding dummy values to avoid breaking code because of type error
        startDate: "2024-04-10",
      };
    });

    return opinions;
  } catch (error) {
    throw new Error(`Error fetching opinions: ${(error as Error).message}`);
  }
};


export const getUserOpinions = async (config?: FetchConfig): Promise<Opinion[]> => {
  try {
    const url = "/user_opinions";
    const userOpinionsData = await get<any[]>(url, config);

    const userOpinions: Opinion[] = userOpinionsData.map((userOpinionData) => {
      const yesVote: Vote = {
        option: OpinionOption.Yes,
        participationCount: userOpinionData.opinion.yes_count,
        coins: userOpinionData.opinion.yes_coins,
      };

      const noVote: Vote = {
        option: OpinionOption.No,
        participationCount: userOpinionData.opinion.no_count,
        coins: userOpinionData.opinion.no_coins,
      };

      const userVote: UserVote = {
          selectedOption: userOpinionData.answer === 'yes' ? OpinionOption.Yes : OpinionOption.No,
          coinsUsed: userOpinionData.coins,
      }

      // Set the result only if the result computation is finished. Check that from the correct_answer field and if it's
      // set or not.
      const result: PulseResult<OpinionOption> | undefined = userOpinionData.opinion.correct_answer !== null ? {
        type: userOpinionData.answer === userOpinionData.opinion.correct_answer ? PulseResultType.Won : PulseResultType.Lost,
        coinsUsed: userOpinionData.coins,
        coinsResult: userOpinionData.coins_won,
        finalValue: userOpinionData.opinion.correct_answer === 'yes' ? OpinionOption.Yes : OpinionOption.No,
      } : undefined;

      return {
        type: PulseType.Opinion,
        opinionId: userOpinionData.opinion_id.toString(),
        title: userOpinionData.opinion.text,
        endDate: userOpinionData.opinion.end_date,
        filmId: userOpinionData.opinion.film_id.toString(),
        filmPosterSrc: userOpinionData.opinion.icon_url,
        votes: [yesVote, noVote],
        userVote: userVote,
        result: result,
        // Adding dummy values to avoid breaking code because of type error
        startDate: "2024-04-10",
      };
    });

    return userOpinions;
  } catch (error) {
    throw new Error(`Error fetching user opinions: ${(error as Error).message}`);
  }
};

export const postUserOpinion = async (
  opinionId: number,
  coins: number,
  answer: string,
  config?: FetchConfig,
): Promise<void> => {
  try {
    const url = "/user_opinions";
    const body = {
      opinion_id: opinionId,
      coins: coins,
      answer: answer,
    };
    await post<void>(url, body, config);
  } catch (error) {
    throw new Error(`Error posting user opinion: ${(error as Error).message}`);
  }
};

export const getPredictions = async (
  filmId: number,
  limit: number,
  config?: FetchConfig,
): Promise<Prediction[]> => {
  try {
    let url = "/predictions";
    if (filmId) {
      url += `?film_id=${filmId}`;
    }
    if (limit) {
      url += limit === 0 ? "" : `&limit=${limit}`; // Avoid adding limit=0 as it's unnecessary
    }
    const predictionsData = await get<any[]>(url, config);

    const predictions: Prediction[] = predictionsData.map((predictionData) => {
      return {
        type: PulseType.Prediction,
        predictionId: predictionData.id.toString(),
        title: predictionData.text,
        filmId: predictionData.film_id.toString(),
        participationCount: predictionData.user_count,
        meanPrediction: predictionData.mean_value || 0,
        endDate: predictionData.end_date,
        predictionRange: [predictionData.min_value, predictionData.max_value],
        userPrediction: predictionData.user_vote?.answer || null,
        predictionStepValue: predictionData.step_value || 25,
        predictionScaleUnit: predictionData.scale_unit || "",
        // Adding dummy values to avoid breaking code because of type error.
        startDate: "2024-04-10",
      };
    });

    return predictions;
  } catch (error) {
    throw new Error(`Error fetching predictions: ${(error as Error).message}`);
  }
};

export const getUserPredictions = async (config?: FetchConfig): Promise<Prediction[]> => {
  try {
    const url = "/user_predictions";
    const userPredictionsData = await get<any[]>(url, config);

    const userPredictions: Prediction[] = userPredictionsData.map((userPredictionData) => {

      // Populate result only if there is a rank in userPredictionData implying that the result
      // computation has finished.
      const result: PulseResult<number> | undefined = userPredictionData.rank !== null ? {
        type: userPredictionData.coins_won > 0 ? PulseResultType.Won : PulseResultType.None,
        coinsResult: userPredictionData.coins_won,
        ranking: userPredictionData.rank,
        finalValue: userPredictionData.prediction.correct_answer,
      } : undefined;

      return {
        type: PulseType.Prediction,
        predictionId: userPredictionData.prediction_id.toString(),
        title: userPredictionData.prediction.text,
        filmId: userPredictionData.prediction.film_id.toString(),
        participationCount: userPredictionData.prediction.user_count,
        meanPrediction: userPredictionData.prediction.mean_value || 0,
        endDate: userPredictionData.prediction.end_date,
        predictionRange: [userPredictionData.prediction.min_value,
          userPredictionData.prediction.max_value],
        userPrediction: userPredictionData.answer,
        predictionStepValue: userPredictionData.prediction.step_value || 25,
        predictionScaleUnit: userPredictionData.prediction.scale_unit || "",
        result: result,
        // Adding dummy values to avoid breaking code because of type error.
        startDate: "2024-04-10",
      };
    });

    return userPredictions;
  } catch (error) {
    throw new Error(`Error fetching user predictions: ${(error as Error).message}`);
  }
};

export const postUserPrediction = async (
  predictionId: number,
  answer: number,
  config?: FetchConfig,
): Promise<void> => {
  try {
    const url = "/user_predictions";
    const body = {
      prediction_id: predictionId,
      answer: answer,
    };
    await post<void>(url, body, config);
  } catch (error) {
    throw new Error(
      `Error posting user prediction: ${(error as Error).message}`,
    );
  }
};

export const getVouchers = async (config?: FetchConfig): Promise<CouponDetail[]> => {
  try {
    const url = "/vouchers";
    const vouchersData = await get<any[]>(url, config);

    const vouchers: CouponDetail[] = vouchersData.map((voucher) => ({
      couponId: voucher.id.toString(),
      worthCoins: voucher.coins,
      couponLogoSrc: voucher.icon_url,
      couponInfo: voucher.summary,
      couponBrandName: voucher.name,
      couponExpiryDate: "2024-12-31", // Adding a dummy value for now
      couponTnCs: voucher.terms ? [voucher.terms] : undefined,
    }));

    return vouchers;
  } catch (error) {
    throw new Error(`Error fetching vouchers: ${(error as Error).message}`);
  }
};

const secretKey = 'Ggm1M5JGlB6wDmfhVMIzMdmRqctsJKXWzOemNDixIBI='
const secret = new fernet.Secret(secretKey)

export const decrypt = (encryptedText: string): string => {
  try {
    const token = new fernet.Token({
      secret: secret,
      token: encryptedText,
      ttl: 0,  // Time-to-live (ttl) set to 0 means the token will never expire
    });
    return token.decode();
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}`);
  }
};

// This will fetch just 1 coupon code corresponding to a coupon id (brand).
export const getVoucherCode = async (couponId: number,
  config?: FetchConfig): Promise<CouponCode[]> => {

  try {
    const url = `/voucher_codes?voucher_id=${couponId}&limit=1`
    const voucherCodesData = await get<any[]>(url, config);

    const voucherCodes: CouponCode[] = voucherCodesData.map(voucherCodeData => ({
      couponCode: decrypt(voucherCodeData.code),
      expiryDate: voucherCodeData.expiry_date,
    }));

    return voucherCodes;

  } catch (error) {
    throw new Error(`Error fetching voucher code: ${(error as Error).message}`);
  }
};

export const getClaimedVouchers = async (config?: FetchConfig): Promise<CouponCode[]> => {
  try {
    const url = `/voucher_codes?claimed=true`
    const voucherCodesData = await get<any[]>(url, config);

    const voucherCodes: CouponCode[] = voucherCodesData.map(voucherCodeData => ({
      couponCode: decrypt(voucherCodeData.code),
      expiryDate: voucherCodeData.expiry_date,
    }));

    return voucherCodes;

  } catch (error) {
    throw new Error(`Error fetching claimed vouchers for users: ${(error as Error).message}`);
  }
};