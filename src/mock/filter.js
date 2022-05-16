import { getFilters } from '../util/filter.js';

export const generateFilter = (filmsModel) => {
  const filterList = [];
  getFilters().forEach((value, key) => {
    filterList.push({
      path: key.path,
      name: key.title,
      count: value(filmsModel).length,
    });
  });
  return filterList;
};
