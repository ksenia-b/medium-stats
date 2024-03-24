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
  if (!date) {
    return '';
  }
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(d);
};

export const getColorByIndex = (index) => {
  const colors = ['#C5E2FF', '#457BFF', '#9EEEFF', '#DC6BE4', '#7AFAFA', '#FF6DB0', '#84FFD3', '#FF937D', '#B7FF9F', '#FFC75F', '#F9F871', '#F9F871', '#3AAF51', '#B5E5A4', '#009D6D', '#7FC7A1', '#00897D', '#56A89A', '#00737E', '#025D71', '#3D878C', '#346775', '#2F4858', '#2F4858'];

  return index < colors.length ? colors[index] : `#${Math.floor(Math.random()*16777215).toString(16)}`
}
