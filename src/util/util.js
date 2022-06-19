import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getYearFromDate = (date) => dayjs(date).year();

export const transformIntToHour = (int) =>dayjs.duration(int, 'minutes').format('H[h] m[min]');

export const humanizeDateRelease = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');
export const humanizeDateComment = (dueDate) => dayjs(dueDate).format('YYYY/M/D H:m');

export const isEscapeEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
export const isCtrlEnterEvent = (evt) => evt.ctrlKey && evt.key === 'Enter';
export const isCommandEnterEvent = (evt) => evt.metaKey && evt.key === 'Enter';

export const sortDateDown = (taskA, taskB) => dayjs(taskA).diff(dayjs(taskB));

