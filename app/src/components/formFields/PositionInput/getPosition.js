import { POSITION_DECIMAL_PRECISION } from "../../../constants/forms";
import { appendZeros, roundNumber } from "../../../utils/math";

const formatCoordinate = (value) => {
  return appendZeros(
    roundNumber(value, POSITION_DECIMAL_PRECISION),
    POSITION_DECIMAL_PRECISION
  );
};

function currentPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

export const getPosition = async () => {
  const timeout = 10000;
  try {
    const response = await currentPosition({ timeout });
    const position = {
      latitude: formatCoordinate(response.coords.latitude),
      longitude: formatCoordinate(response.coords.longitude),
    };
    return { position, error: false };
  } catch (err) {
    return { position: null, error: true };
  }
};
