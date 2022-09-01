import {FilterType} from '../const.js';
import {isEventActive} from './event.js';

export const eventFilter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((eventsItem) => isEventActive(eventsItem.dateFrom)),
};
