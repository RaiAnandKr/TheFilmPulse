export const mergeArrayToMap = <V extends object>(
  map: Map<string, V>,
  arr: Array<V>,
  propertyAsMapKey: keyof V,
  addMoreProperties?: Partial<V>,
): Map<string, V> => {
  const updatedMap = new Map(map);

  arr
    .filter((arrElement) => propertyAsMapKey in arrElement)
    .forEach((arrElement) => {
      const keyForMap = arrElement[propertyAsMapKey] as string;
      updatedMap.set(keyForMap, {
        ...updatedMap.get(keyForMap),
        ...arrElement,
        ...addMoreProperties,
      });
    });

  return updatedMap;
};
