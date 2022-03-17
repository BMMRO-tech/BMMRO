import { POSITION_DECIMAL_PRECISION } from "../../../constants/forms";
import { appendZeros, roundNumber } from "../../../utils/math";

const formatCoordinate = (value) => {
  return appendZeros(
    roundNumber(value, POSITION_DECIMAL_PRECISION),
    POSITION_DECIMAL_PRECISION
  );
};

function currentPosition() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}

export const getPosition = async () => {
  try {
    const response = await currentPosition();
    const position = {
      latitude: formatCoordinate(response.coords.latitude),
      longitude: formatCoordinate(response.coords.longitude),
    };
    return { position, error: null };
  } catch (err) {
    return { position: null, error: true };
  }
};
