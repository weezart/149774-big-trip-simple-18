export const ucFirst = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};


export const isNumeric = (num) => !isNaN(num) && num !== null;
