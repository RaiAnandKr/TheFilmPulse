import { Film, Prediction } from '../schema/Film';

const BASE_URL = 'https://backend.gentleisland-bcedf421.centralindia.azurecontainerapps.io';

interface FetchConfig extends RequestInit {
  headers?: HeadersInit;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API call failed');
  }
  return response.json();
};

export const get = async <T>(url: string, config?: FetchConfig): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...(config?.headers || {}),
    },
  });
  return handleResponse(response);
};

export const getFilms = async (config?: FetchConfig): Promise<Film[]> => {
  try {
    const filmsData = await get<any[]>('/films', config);

    // Convert the JSON response to align with schema defined in ../schema/
    // TODO: Few fields need to be added to the API to support the full schema
    // defined and used in the frontend code.
    const films: Film[] = filmsData.map((filmData: any) => {

      const predictionData = filmData.top_prediction;
      const topPrediction: Prediction = {
        predictionId: predictionData.id,
        title: predictionData.text,
        filmId: predictionData.film_id,
        participationCount: predictionData.user_count,
      };

      return {
        filmId: filmData.id.toString(),
        title: filmData.title,
        videoSrc: filmData.trailer_url,
        imgSrc: filmData.poster_url,
        topPrediction: topPrediction,
      };
    });

    return films;
  } catch (error) {
    throw new Error(`Error fetching films: ${(error as Error).message}`);
  }
};

export const getOpinions = async (config?: FetchConfig) => {
  return get<any[]>('/opinions', config);
};

export const getPredictions = async (config?: FetchConfig) => {
  return get<any[]>('/predictions', config);
};

