import AbstractView from '../framework/view/abstract-view.js';

const getRang = (count) => {
  if (count >= 1 && count < 11) {
    return 'novice';
  }
  if (count >= 11 && count < 21) {
    return 'fan';
  }
  return 'movie buff';
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
