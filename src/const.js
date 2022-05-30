export const FilterType = {
  ALL: {
    path: 'all',
    title: 'All movies'
  },
  WATCH_LIST: {
    path: 'watchlist',
    title: 'Watchlist'
  },
  HISTORY: {
    path: 'history',
    title: 'History'
  },
  FAVORITES: {
    path: 'favorites',
    title: 'Favorites'
  },
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const UserAction = {
  UPDATE_FILMS: 'UPDATE_FILMS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
