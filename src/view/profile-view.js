import AbstractView from '../framework/view/abstract-view.js';

const RANG_MOVIE_BUFF = 20;
const RANG_FAN = 10;

const getRang = (count) => {
  if (count > RANG_MOVIE_BUFF) {
    return 'Movie buff';
  }
  if (count > RANG_FAN) {
    return 'Fan';
  }
  return 'Novice';
};

const createProfileTemplate = (countFilms) => {
  if (!countFilms) {
    return '<section class="header__profile profile"></section>';
  }
  const rang = getRang(countFilms);

  return `<section class="header__profile profile">
    <p class="profile__rating">${rang}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};
export default class ProfileView extends AbstractView {
  #countFilms;

  constructor(countFilms) {
    super();
    this.#countFilms = countFilms;
  }

  get template() {
    return createProfileTemplate(this.#countFilms);
  }

}
