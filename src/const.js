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

export const OFFER_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

export const OFFERS = [
  'Add luggage',
  'Order Uber',
  'Rent a car',
  'Switch to comfort',
  'Add breakfast',
  'Book tickets',
  'Lunch in city'
];

export const OFFER_INPUTS = {
  'Add luggage': 'luggage',
  'Order Uber': 'uber',
  'Rent a car': 'car',
  'Switch to comfort': 'comfort',
  'Add breakfast': 'breakfast',
  'Book tickets': 'tickets',
  'Lunch in city': 'city'
};

export const DESTINATIONS = [
  'Chamonix',
  'Amsterdam',
  'Rome',
  'Madrid',
  'Geneva',
  'Paris',
  'Moscow',
  'London',
  'Tokio',
  'Barcelona'
];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export const BLANK_POINT = {
  basePrice: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  offers:[],
  type: 'taxi',
};

export const PHOTO_URL = 'https://dummyimage.com/248x152';
