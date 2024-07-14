export const isValidPrediction = (prediction: number | null | undefined) =>
  typeof prediction === "number" && !isNaN(prediction);
