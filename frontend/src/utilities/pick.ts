export const pick = <T extends {}, K extends keyof T>(obj: T, keys: K[]) =>
  Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  ) as Pick<T, K>;
