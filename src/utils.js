import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

// Массив заданной длины случайных элементов.
export const getRandomizedReducedArray = (array, count) => array.slice().sort(() => Math.random() - 0.5).slice(0, count);

export const humanizeDateToTimeDate = (data) => dayjs(data).format('YYYY-MM-DD[T]HH:mm');
export const humanizeDateToTimeDateMini = (data) => dayjs(data).format('YYYY-MM-DD');
export const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const humanizeDateToTime = (date) => dayjs(date).format('HH:mm');
export const humanizeDateToDayMonth = (data) => dayjs(data).format('MMM DD');
export const humanizeDateToYear = (date) => dayjs(date).format('YYYY');

export const getRandomDay = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};
