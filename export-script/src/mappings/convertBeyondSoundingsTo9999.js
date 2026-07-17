const convertBeyondSoundingsTo9999 = (val, data) => {
  if (data.waterDepthBeyondSoundings) return 9999;
  else return val;
};

export default convertBeyondSoundingsTo9999;
