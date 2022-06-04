import { getRandomNumber } from '../util/util.js';
import { EMOTIONS } from '../const.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const COMMENT_COUNT_MAX = 10;

const comments = [];

const generateDate = (minDayGap, maxDayGap) => {
  const daysGap = getRandomNumber(minDayGap, maxDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

const createComment = () => ({
  id: nanoid(),
  author: 'Ilya OReilly',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: generateDate(-7, 0),
  emotion: EMOTIONS[getRandomNumber(0, EMOTIONS.length - 1)]
});

export const generateComments = () => {
  const countComments = getRandomNumber(0, COMMENT_COUNT_MAX);
  const filmComments = [];
  for (let i = 0; i < countComments; i++) {
    const newComment = createComment();
    comments.push(newComment);
    filmComments.push(newComment);
  }
  return filmComments;
};

export const getComments = () => comments;
