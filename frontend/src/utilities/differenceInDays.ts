const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const differenceInDays = (startDate: Date, endDate: Date) => {
  const startDateUtc = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const endDateUtc = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  return Math.floor((endDateUtc - startDateUtc) / MS_PER_DAY);
};
