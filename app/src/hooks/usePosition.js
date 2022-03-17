import { POSITION_DECIMAL_PRECISION } from "../constants/forms";
import { appendZeros, roundNumber } from "../utils/math";

let position = { latitude: "", longitude: "" };
let error;

const formatCoordinate = (value) => {
  return appendZeros(
    roundNumber(value, POSITION_DECIMAL_PRECISION),
    POSITION_DECIMAL_PRECISION
  );
};

const onChange = ({ coords }) => {
  console.log(coords);
  position.latitude = formatCoordinate(coords.latitude);
  position.longitude = formatCoordinate(coords.longitude);
};

const onError = (err) => {
  error = err.message;
};

export const getPosition = () => {
  const geo = navigator.geolocation;
  const timeoutDuration = 10000;
  if (!geo) {
    error = "Geolocation is not supported";
  } else {
    geo.getCurrentPosition(onChange, onError, { timeout: timeoutDuration });
    error = null;
  }

  return { ...position, error };
};
