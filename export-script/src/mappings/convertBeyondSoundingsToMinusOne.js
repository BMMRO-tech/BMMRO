const convertBeyondSoundingsToMinusOne = (val, data) => {
  if (data.waterDepthBeyondSoundings) return -1;
  else return val;
};

export default convertBeyondSoundingsToMinusOne;
