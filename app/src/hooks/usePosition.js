import { useState, useEffect } from "react";
import { POSITION_DECIMAL_PRECISION } from "../forms/constants";

export const usePosition = () => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const roundCoordinate = (value) =>
    +(
      Math.round(value + "e+" + POSITION_DECIMAL_PRECISION) +
      "e-" +
      POSITION_DECIMAL_PRECISION
    );

  const onChange = ({ coords }) => {
    setPosition({
      latitude: roundCoordinate(coords.latitude),
      longitude: roundCoordinate(coords.longitude),
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
      geo.getCurrentPosition(onChange, onError);
    }
    // eslint-disable-next-line
  }, []);

  return { ...position, error };
};
