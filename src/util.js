import dayjs from 'dayjs';

export const createRandomNumber = (min, max) => {
  if (min <= max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  return 'Введите число в установленном диапазоне';
};

export const getUid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getYearFromDate = (date) => dayjs(date).year();

export const transformIntToHour = (int) => {
  const h = Math.floor(int / 60);
  const m = Math.floor(int % 60);

  const hDisplay = h > 0 ? `${h} h ` : '';
  const mDisplay = m > 0 ? `${m} m ` : '';
  return hDisplay + mDisplay;

};

