import { FilterType } from '../const.js';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCH_LIST]: (films) => films.filter((film) => film.userDetails.watchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite)
};


