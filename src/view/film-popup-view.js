import AbstractView from '../framework/view/abstract-view.js';
import { formatDuration, formatReleaseFilm, formatCommentDate, getComments } from '../utils.js';
import { COMMENT_EMOTIONS } from '../consts.js';
import { commentItems } from '../mock/film.js';

const createCommentsListTemplate = (commentIds) => {
  const comments = getComments(commentItems, commentIds);
  return(`
    <ul class="film-details__comments-list">${comments.map((comment) => (
      `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`)).join('')}
    </ul>`
  );
};

const createNewCommentTemplate = () => (`
  <form class="film-details__new-comment" action="" method="get">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">${COMMENT_EMOTIONS.map((emotion) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`).join('')}
    </div>
  </form>
`);

const createFilmPopupTemplate = (film) => {
  const {comments, filmInfo} = film;
  const commentsTemplate = createCommentsListTemplate(comments);
  const newCommentTemplate = createNewCommentTemplate();

  return(`
    <section class="film-details">
      <div class="film-details__inner">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.alternativeTitle}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatReleaseFilm(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Duration</td>
                  <td class="film-details__cell">${formatDuration(filmInfo.duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${filmInfo.genre.map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`).join('')}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments${comments.length > 0 ? `<span class="film-details__comments-count"> ${comments.length}</span>` : ''}</h3>

            ${commentsTemplate}
            ${newCommentTemplate}

          </section>
        </div>
      </div>
    </section>`
  );
};

export default class FilmPopupView extends AbstractView {
  #film = null;
  #handleClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#handleClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickHandler);
    this.element.querySelector('#watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('#watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('#favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick(this.#film);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
