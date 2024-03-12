export const calculateEarnings = (data) => {
  if (!data || !data.nanos) {
    return 0;
  }

  const cents = (data.nanos / 10000000) / 100;

  return data.units + cents;
}

export const getToday = () => {
  const today = new Date();
  today.setHours(0,0,0,0);

  return today.getTime();
}

export const getTimeDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0,0,0,0);

  return date.getTime();
}

export const dateFormatter = date => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(d);
};
