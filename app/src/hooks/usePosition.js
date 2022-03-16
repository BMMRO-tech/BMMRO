import { useState, useEffect } from "react";
import { POSITION_DECIMAL_PRECISION } from "../constants/forms";
import { appendZeros, roundNumber } from "../utils/math";

const formatCoordinate = (value) => {
  return appendZeros(
    roundNumber(value, POSITION_DECIMAL_PRECISION),
    POSITION_DECIMAL_PRECISION
  );
};

export const usePosition = (refresh) => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    setPosition({
      latitude: formatCoordinate(coords.latitude),
      longitude: formatCoordinate(coords.longitude),
    });
  };

  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
    } else {
      geo.getCurrentPosition(onChange, onError, { timeout: 30000 });
      setError(null);
    }
    // eslint-disable-next-line
  }, [refresh]);

  return { ...position, error };
};
