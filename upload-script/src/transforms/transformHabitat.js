import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";
import convertNotNotedToEmpty from "../mappings/convertNotNotedToEmpty.js";
import convertToInteger from "../mappings/convertToInteger.js";
import convertWaveHeightOption from "../mappings/convertWaveHeightOption.js";

const transformHabitat = (habitats) => {
  habitats.map((habitat) => {
    habitat.date = convertDateToTimestamp(habitat.date);
    habitat.behaviour = convertNotNotedToEmpty(habitat.behaviour);
    habitat.surfaceBout = convertToInteger(habitat.surfaceBout);
    habitat.swellWaveHeight = convertWaveHeightOption(habitat.swellWaveHeight);
    habitat.exported = true;
  });

  return habitats;
};

export default transformHabitat;
