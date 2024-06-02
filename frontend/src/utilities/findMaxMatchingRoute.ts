export function findMaxMatchingRoute(
  routes: string[],
  path: string,
): string | null {
  let maxMatchingRoute: string | null = null;
  let maxMatchLength = 0;

  routes.forEach((route) => {
    const commonPrefixLength = getCommonPrefixLength(route, path);
    if (commonPrefixLength > maxMatchLength) {
      maxMatchLength = commonPrefixLength;
      maxMatchingRoute = route;
    }
  });

  return maxMatchingRoute;
}

function getCommonPrefixLength(str1: string, str2: string): number {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }
  return i;
}
