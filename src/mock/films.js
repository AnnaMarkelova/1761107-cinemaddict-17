
import { getRandomNumber, getUid } from '../util/util.js';
import dayjs from 'dayjs';
import { getComments } from './comments.js';

const DESCRIPTION = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.
`.split('.');

const FILM_COUNT = 23;

const generateDate = (minDayGap, maxDayGap) => {
  const daysGap = getRandomNumber(minDayGap, maxDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

const generateFilm = () => {
  const filmId = getUid();
  const film = {
    id: filmId,
    comments: getComments().map((comment) => comment.id),
    filmInfo: {
      title: 'A Little Pony Without The Carpet',
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: getRandomNumber(0, 10),
      poster: './images/posters/the-dance-of-life.jpg',
      ageRating: getRandomNumber(0, 18),
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano',
        'Takeshi Kitano',
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman',
        'Morgan Freeman',
        'Morgan Freeman'
      ],
      release: {
        date: generateDate(-100, 100),
        releaseCountry: 'Finland'
      },
      runtime: getRandomNumber(30, 250),
      genre: [
        'Comedy'
      ],
      description: DESCRIPTION[getRandomNumber(0, DESCRIPTION.length - 1)],
    },
    userDetails: {
      watchList: Boolean(getRandomNumber(0, 2)),
      alreadyWatched: Boolean(getRandomNumber(0, 2)),
      watchingDate: generateDate(-100, 0),
      favorite: Boolean(getRandomNumber(0, 2))
    }
  };

  return film;
};

export const getFilms = () => Array.from({length: FILM_COUNT}, generateFilm);
