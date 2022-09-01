import {eventFilter} from '../utils/event-filter.js';

export const generateEventFilter = () => Object.entries(eventFilter).map(
  ([filterName]) => ({
    name: filterName,
  }),
);
