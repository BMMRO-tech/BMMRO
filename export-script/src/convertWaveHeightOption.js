const convertWaveHeightOption = (option) => {
  if (option) {
    return option === "6+" ? 99 : Number(option);
  }
  return "";
};

module.exports = convertWaveHeightOption;
