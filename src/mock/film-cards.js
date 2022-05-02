
import { createRandomNumber, getUid } from '../util.js';
import dayjs from 'dayjs';

const COMMENT_COUNT_MAX = 10;
const COMMENT_EMOTION = ['smile', 'sleeping', 'puke', 'angry'];
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

const generateDate = (maxDayGap, minDayGap) => {
  const daysGap = createRandomNumber(maxDayGap, minDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

export const generateComments = (filmId, film) => {
  const countComments = createRandomNumber(0, COMMENT_COUNT_MAX);
  const commentsList = [];
  for (let i = 0; i < countComments; i++) {
    const obj = {
      id: filmId + i,
      author: 'Ilya OReilly',
      comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
      date: generateDate(-7, 0),
      emotion: COMMENT_EMOTION[createRandomNumber(0, COMMENT_EMOTION.length - 1)]
    };
    commentsList.push(obj);
    film.comments.push(obj.id);
  }
  return commentsList;
};

export const generateFilm = () => {
  const filmId = getUid();
  const film = {
    id: filmId,
    comments: [],
    filmInfo: {
      title: 'A Little Pony Without The Carpet',
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: 7.3,
      poster: './images/posters/the-dance-of-life.jpg',
      ageRating: createRandomNumber(0, 18),
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
      runtime: createRandomNumber(30, 250),
      genre: [
        'Comedy'
      ],
      description: DESCRIPTION[createRandomNumber(0, DESCRIPTION.length - 1)],
    },
    userDetails: {
      watchList: Boolean(createRandomNumber(0, 2)),
      alreadyWatched: Boolean(createRandomNumber(0, 2)),
      watchingDate: generateDate(-100, 0),
      favorite: Boolean(createRandomNumber(0, 2))
    }
  };
  const comments = generateComments(filmId, film);

  return {
    film,
    comments
  };
};
