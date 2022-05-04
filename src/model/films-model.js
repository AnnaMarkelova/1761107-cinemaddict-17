import { getFilms } from '../mock/films';

export default class FilmsModel {

  #films = getFilms();

  get films () {
    return this.#films;
  }
}
