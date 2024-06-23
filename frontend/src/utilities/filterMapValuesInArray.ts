export const filterMapValuesInArray = <K, V>(
  map: Map<K, V>,
  predicate: (key: K, value: V) => boolean,
): Array<V> => {
  const filteredArray = Array<V>();
  for (const [k, v] of map) {
    if (predicate(k, v)) {
      filteredArray.push(v);
    }
  }
  return filteredArray;
};
