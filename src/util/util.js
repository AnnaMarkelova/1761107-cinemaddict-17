import dayjs from 'dayjs';

export const getRandomNumber = (min, max) => {
  if (min <= max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  return 'Введите число в установленном диапазоне';
};

export const getYearFromDate = (date) => dayjs(date).year();

export const transformIntToHour = (int) => {
  const h = Math.floor(int / 60);
  const m = Math.floor(int % 60);

  const hDisplay = h > 0 ? `${h} h ` : '';
  const mDisplay = m > 0 ? `${m} m ` : '';
  return hDisplay + mDisplay;

};

export const humanizeDateRelease = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');
export const humanizeDateComment = (dueDate) => dayjs(dueDate).format('YYYY/M/D H:m');

export const isEscapeEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};