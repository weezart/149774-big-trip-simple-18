import AbstractView from '../framework/view/abstract-view.js';
import {ucFirst} from '../utils/common.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${ucFirst(name)}</label>
    </div>`
  );
};

const createFiltersTemplate = (eventFilters, currentFilterType) => {
  const filterItemsTemplate = eventFilters
    .map((filterItem) => createFilterItemTemplate(filterItem, currentFilterType))
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
  #currentFilter = null;

  constructor(eventFilters, currentFilterType) {
    super();
    this.#eventFilters = eventFilters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#eventFilters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
