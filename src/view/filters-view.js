import AbstractView from '../framework/view/abstract-view.js';
import {ucFirst} from '../utils/common.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter${name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name}"
        ${isChecked ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${ucFirst(name)}</label>
    </div>`
  );
};

const createFiltersTemplate = (eventFilters) => {
  const filterItemsTemplate = eventFilters
    .map((filterItem, index) => createFilterItemTemplate(filterItem, index === 0))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView extends AbstractView {
  #eventFilters = null;

  constructor(eventFilters) {
    super();
    this.#eventFilters = eventFilters;
  }

  get template() {
    return createFiltersTemplate(this.#eventFilters);
  }
}
