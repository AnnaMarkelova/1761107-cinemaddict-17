import { filter } from '../util/filter.js';

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);
