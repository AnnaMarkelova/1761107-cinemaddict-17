import { getFilms } from '../mock/films';

export default class FilmsModel {

  films = getFilms();

  getFilms = () => this.films;
}
