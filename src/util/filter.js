import { FilterType } from '../const.js';

export const getFilters = () => {
  const filter = new Map();
  filter.set(FilterType.ALL, (filmsModel) => filmsModel.films);
  filter.set(FilterType.WATCH_LIST, (filmsModel) => filmsModel.getWatchList());
  filter.set(FilterType.HISTORY, (filmsModel) => filmsModel.getAlreadyWatchedList());
  filter.set(FilterType.FAVORITES, (filmsModel) => filmsModel.getFavoriteList());
  return filter;
};
