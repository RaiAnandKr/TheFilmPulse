export const gcdOfNumbers = (arr: number[]) => {
  const arrLength = arr.length;
  let result = arr[0] ?? 0;
  for (let i = 1; i < arrLength; i++) {
    result = gcd(arr[i] ?? 0, result);

    if (result == 1) {
      return 1;
    }
  }
  return result;
};

function gcd(a: number, b: number) {
  if (a == 0) return b;
  return gcd(b % a, a);
}
