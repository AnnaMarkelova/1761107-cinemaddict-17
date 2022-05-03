import { getRandomNumber, getUid } from '../util.js';
import dayjs from 'dayjs';

const COMMENT_COUNT_MAX = 10;
const COMMENT_EMOTION = ['smile', 'sleeping', 'puke', 'angry'];

const generateDate = (minDayGap, maxDayGap) => {
  const daysGap = getRandomNumber(minDayGap, maxDayGap);
  return dayjs().add(daysGap, 'day').toDate().toISOString();
};

const createComment = () => ({
  id: getUid(),
  author: 'Ilya OReilly',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: generateDate(-7, 0),
  emotion: COMMENT_EMOTION[getRandomNumber(0, COMMENT_EMOTION.length - 1)]
});

const generateComments = () => {
  const countComments = getRandomNumber(0, COMMENT_COUNT_MAX);
  const commentsList = [];
  for (let i = 0; i < countComments; i++) {
    commentsList.push(createComment());
  }
  return commentsList;
};

const comments = generateComments();

export const getComments = () => comments;
