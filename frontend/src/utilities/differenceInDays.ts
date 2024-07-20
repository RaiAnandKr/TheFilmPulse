const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const differenceInDays = (startDate: Date, endDate: Date) => {
  const startDateUtc = startDate.getTime();
  const endDateUtc = endDate.getTime();

  return Math.floor((endDateUtc - startDateUtc) / MS_PER_DAY);
};
