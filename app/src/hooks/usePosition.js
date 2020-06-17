import { useState, useEffect } from "react";
import { POSITION_DECIMAL_PRECISION } from "../constants/forms";

export const usePosition = () => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const roundCoordinate = (value) =>
    +(
      Math.round(value + "e+" + POSITION_DECIMAL_PRECISION) +
      "e-" +
      POSITION_DECIMAL_PRECISION
    );

  const appendZero = (val) => {
    const digitsMissing =
      POSITION_DECIMAL_PRECISION - (val.toString().split(".")[1] || []).length;
    let stringVal = val.toString();

    return stringVal.concat("0".repeat(digitsMissing));
  };

  const onChange = ({ coords }) => {
    setPosition({
      latitude: appendZero(roundCoordinate(coords.latitude)),
      longitude: appendZero(roundCoordinate(coords.longitude)),
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
