import dayjs from 'dayjs';

export const humanizeDateToTimeDate = (data) => dayjs(data).format('YYYY-MM-DD[T]HH:mm');
export const humanizeDateToTimeDateMini = (data) => dayjs(data).format('YYYY-MM-DD');
export const humanizeDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');
export const humanizeDateToTime = (date) => dayjs(date).format('HH:mm');
export const humanizeDateToDayMonth = (data) => dayjs(data).format('MMM DD');
export const isEventActive = (eventDate) => eventDate && dayjs().isBefore(eventDate, 'D');

export const updateEvent = (events, update) => {
  const index = events.findIndex((event) => event.id === update.id);

  if (index === -1) {
    return events;
  }

  return [
    ...events.slice(0, index),
    update,
    ...events.slice(index + 1),
  ];
};
