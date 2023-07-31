const convertWaveHeightOption = (option) => {
  if (option) {
    return option === 99 || "99" ? "6+" : Number(option);
  }
  return "";
};

module.exports = convertWaveHeightOption;
