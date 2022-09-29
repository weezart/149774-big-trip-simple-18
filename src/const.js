export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const BLANK_POINT = {
  basePrice: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  offers:[],
  type: 'taxi',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const EDITING_CLOSE_TIMEOUT = 300;

export const AUTHORIZATION = 'Basic zTS2sg404s4d4gwl1sd2wj';
export const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
