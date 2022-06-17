import AbstractView from '../framework/view/abstract-view.js';

const getRang = (count) => {
  if (count > 20) {
    return 'movie buff';
  }
  if (count > 10) {
    return 'fan';
  }
  return 'novice';
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
