import dayjs from 'dayjs';

export const humanizeDateToTimeDate = (data) => dayjs(data).format('YYYY-MM-DD[T]HH:mm');
export const humanizeDateToTimeDateMini = (data) => dayjs(data).format('YYYY-MM-DD');
export const humanizeDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');
export const humanizeDateToTime = (date) => dayjs(date).format('HH:mm');
export const humanizeDateToDayMonth = (data) => dayjs(data).format('MMM DD');
export const isEventActive = (eventDate) => eventDate && dayjs().isBefore(eventDate, 'D');

const getWeightForNull = (A, B) => {
  if (A === null && B === null) {
    return 0;
  }

  if (A === null) {
    return 1;
  }

  if (B === null) {
    return -1;
  }
};

export const sortByDay = (pointA, pointB) => {
  const weight = getWeightForNull(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

export const sortByPrice = (pointA, pointB) => {
  const weight = getWeightForNull(pointA.basePrice, pointB.basePrice);

  return weight ?? pointB.basePrice - pointA.basePrice;
};

export const isNumeric = (num) => !isNaN(num) && num !== null;

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
