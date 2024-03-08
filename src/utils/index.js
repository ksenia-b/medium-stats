export const calculateEarnings = (data) => {
  if (!data || !data.nanos) {
    return 0;
  }

  const cents = (data.nanos / 10000000) / 100;

  return data.units + cents;
}
