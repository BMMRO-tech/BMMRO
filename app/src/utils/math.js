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
    const modifiedValue = modified[key];
    const originalValue = original[key];

    if (modifiedValue === originalValue) return diff;

    // Dates representing the same instant are not modifications, even when they
    // are different object references (e.g. re-created by react-datepicker).
    if (
      modifiedValue instanceof Date &&
      originalValue instanceof Date &&
      modifiedValue.getTime() === originalValue.getTime()
    ) {
      return diff;
    }

    return {
      ...diff,
      [key]: modifiedValue,
    };
  }, {});
};
