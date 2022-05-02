export const createRandomNumber = (min, max) => {
  if (min <= max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  return 'Введите число в установленном диапазоне';
};

export const getUid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

