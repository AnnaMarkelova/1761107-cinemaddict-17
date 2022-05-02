import { generateFilm } from '../mock/film-cards.js';

const FILM_COUNT = 7;

export default class FilmsModel {

  dataFilms = Array.from({length: FILM_COUNT}, generateFilm);
  // films = dataFilms.map(dataFilms.film);
  // comments = dataFilms.map(dataFilms.comments);

  getFilms = () => this.dataFilms;

  getComments = () => this.dataFilms;
}
