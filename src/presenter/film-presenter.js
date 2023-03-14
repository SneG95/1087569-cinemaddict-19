import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { fixPopupScroll } from '../utils.js';
import { Keys, Mode, UserAction, UpdateType } from '../consts.js';

export default class FilmPresenter {
  #filmsListContainer = null;
  #commentsModel = null;
  #bodyContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({filmsListContainer, commentsModel, bodyContainer, onDataChange, onModeChange}) {
    this.#filmsListContainer = filmsListContainer;
    this.#commentsModel = commentsModel;
    this.#bodyContainer = bodyContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(film) {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView({
      film: this.#film,
      onClick: this.#handleCardClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#filmPopupComponent = new FilmPopupView({
      film: this.#film,
      commentsModel: this.#commentsModel,
      onClick: this.#handlePopupClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      const currYcoord = prevFilmPopupComponent.element.scrollTop;
      replace(this.#filmCardComponent, prevFilmCardComponent);
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      fixPopupScroll(this.#filmPopupComponent.element, currYcoord);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopup();
    }
  }

  destroy() {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  #addPopup() {
    this.#bodyContainer.classList.add('hide-overflow');
    this.#bodyContainer.append(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #removePopup() {
    this.#bodyContainer.removeChild(this.#filmPopupComponent.element);
    this.#bodyContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      this.#removePopup();
      this.#mode = Mode.DEFAULT;
    }
  };

  #handleCardClick = () => {
    this.#addPopup();
  };

  #handlePopupClick = () => {
    this.#removePopup();
    this.#mode = Mode.DEFAULT;
  };

  #handleWatchlistClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist,
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist,
          }
        }
      );
    }
  };

  #handleWatchedClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            alreadyWatched: !this.#film.userDetails.alreadyWatched
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            alreadyWatched: !this.#film.userDetails.alreadyWatched
          }
        }
      );
    }
  };

  #handleFavoriteClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            favorite: !this.#film.userDetails.favorite
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            favorite: !this.#film.userDetails.favorite
          }
        }
      );
    }
  };

  #handleDeleteClick = (commentId) => {
    if (this.#mode === Mode.EDITING) {
      this.#handleDataChange(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        /*{
          ...this.#film,
          commentId: commentId
        }*/
      );
    }
  };
}
