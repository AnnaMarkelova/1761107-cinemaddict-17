import AbstractView from '../framework/view/abstract-view.js';
import { transformIntToHour, humanizeDateRelease, humanizeDateComment } from '../util/util.js';

const createGenresTemplate = (genres) => genres.map((item) => `<span class="film-details__genre">${item}</span>`);

const createCommentTemplate = (commentItem) => {

  const {
    author,
    comment,
    date,
    emotion,
  } = commentItem;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${humanizeDateComment(date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;

};

const createCommentsTemplate = (commentsList) => commentsList.map((item) => createCommentTemplate(item)).join('');

const createPopupTemplate = (film, commentsList) => {
  const {
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchList,
      alreadyWatched,
      favorite,
    },
  } = film;

  const watchListActive = watchList
    ? 'film-details__control-button--active'
    : '';
  const alreadyWatchedActive = alreadyWatched
    ? 'film-details__control-button--active'
    : '';
  const favoriteActive = favorite
    ? 'film-details__control-button--active'
    : '';
  const genresTemplate = createGenresTemplate(genre);
  const commentsTemplate = createCommentsTemplate(commentsList);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ').trim()}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ').trim()}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeDateRelease(date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${transformIntToHour(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
              ${genresTemplate}
              </td>
            </tr>
          </tbody></table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchListActive}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button  film-details__control-button--watched ${alreadyWatchedActive}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteActive}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsList.length}</span></h3>

        <ul class="film-details__comments-list">
        ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  </section>`;
};
export default class PopupView extends AbstractView {
  #film;
  #comments;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
