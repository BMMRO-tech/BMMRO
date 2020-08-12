export const roundNumber = (value, precision = 0) => {
  return +(Math.round(value + "e+" + precision) + "e-" + precision);
};

export const appendZeros = (value, precision) => {
  const digitsMissing =
    precision - (value.toString().split(".")[1] || []).length;
  const hasPeriod = /\./.test(value.toString());
  const baseString = hasPeriod ? value.toString() : `${value.toString()}.`;
  return baseString.concat("0".repeat(digitsMissing));
};

export const getModifiedProperties = (modified, original) => {
  return Object.keys(original).reduce((diff, key) => {
    if (modified[key] === original[key]) return diff;
    return {
      ...diff,
      [key]: modified[key],
    };
  }, {});
};
