import { parse as json2csv } from "json2csv";
import mapFields from "./mapFields.js";

const transformJsonToCsv = (data, config) => {
  const mappedData = mapFields(data, config);
  return json2csv(mappedData);
};

export default transformJsonToCsv;
