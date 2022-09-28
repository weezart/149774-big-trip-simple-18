import {remove, render, RenderPosition} from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class EventNewPresenter {
  #eventListContainer = null;
  #changeData = null;
  #eventsData = null;
  #eventEditComponent = null;
  #destroyCallback = null;

  constructor(eventListContainer, eventsData, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#eventsData = eventsData;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView(undefined, this.#eventsData);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
