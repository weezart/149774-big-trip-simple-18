import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoEventsTemplate = (filterType) => {
  const noEventsTextValue = NoEventsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noEventsTextValue}
    </p>`);
};

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}
