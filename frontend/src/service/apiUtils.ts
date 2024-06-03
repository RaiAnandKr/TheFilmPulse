/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Film, Prediction } from "../schema/Film";
import { Opinion, Vote, UserVote, OpinionOption } from "../schema/Opinion";

const BASE_URL =
  "https://backend.gentleisland-bcedf421.centralindia.azurecontainerapps.io";

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
  filmId: number,
  config?: FetchConfig,
): Promise<Film[]> => {
  try {
    const url = filmId ? `/films?film_id=${filmId}` : "/films";
    const filmsData = await get<any[]>(url, config);

    // Convert the JSON response to align with schema defined in ../schema/
    // TODO: Few fields need to be added to the API to support the full schema
    // defined and used in the frontend code.
    const films: Film[] = filmsData.map((filmData) => {
      const predictionData = filmData.top_prediction;
      const topPrediction: Prediction = {
        predictionId: predictionData.id,
        title: predictionData.text,
        filmId: predictionData.film_id,
        participationCount: predictionData.user_count,
        // Adding dummy values to avoid breaking code because of type error.
        meanPrediction: 100,
        endDate: "2024-08-10",
        startDate: "2024-04-10",
        predictionRange: [0, 1000],
        predictionStepValue: 25,
        predictionScaleUnit: "Crores",
      };

      return {
        filmId: filmData.id.toString(),
        title: filmData.title,
        videoSrc: filmData.trailer_url,
        imgSrc: filmData.poster_url,
        topPrediction: topPrediction,
        releaseDate: filmData.release_date,
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

    // Convert the JSON response to align with schema defined in ../schema/
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

      return {
        opinionId: opinionData.id.toString(),
        title: opinionData.text,
        // Adding dummy values to avoid breaking code because of type error
        startDate: "2024-04-10",
        endDate: "2024-08-10",
        filmId: opinionData.film_id.toString(),
        filmPosterSrc: opinionData.film_poster_src,
        votes: [yesVote, noVote],
      };
    });

    return opinions;
  } catch (error) {
    throw new Error(`Error fetching opinions: ${(error as Error).message}`);
  }
};

export const getPredictions = async (
  filmId: number,
  config?: FetchConfig,
): Promise<Prediction[]> => {
  try {
    let url = "/predictions";
    if (filmId) {
      url += `?film_id=${filmId}`;
    }
    const predictionsData = await get<any[]>(url, config);

    const predictions: Prediction[] = predictionsData.map((predictionData) => {
      return {
        predictionId: predictionData.id.toString(),
        title: predictionData.text,
        filmId: predictionData.film_id,
        participationCount: predictionData.user_count,
        meanPrediction: 100,
        endDate: "2024-08-10",
        startDate: "2024-04-10",
        predictionRange: predictionData.range,
        predictionStepValue: predictionData.step_value,
        predictionScaleUnit: predictionData.scale_unit,
      };
    });

    return predictions;
  } catch (error) {
    throw new Error(`Error fetching opinions: ${(error as Error).message}`);
  }
};

export const postUserPrediction = async (
  userId: number,
  predictionId: number,
  answer: number,
  config?: FetchConfig,
): Promise<void> => {
  try {
    const url = "/user_predictions";
    const body = {
      user_id: userId,
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

export const postUserOpinion = async (
  userId: number,
  opinionId: number,
  coins: number,
  answer: string,
  config?: FetchConfig,
): Promise<void> => {
  try {
    const url = "/user_opinions";
    const body = {
      user_id: userId,
      opinion_id: opinionId,
      coins: coins,
      answer: answer,
    };
    await post<void>(url, body, config);
  } catch (error) {
    throw new Error(`Error posting user opinion: ${(error as Error).message}`);
  }
};
