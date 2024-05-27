import { generateTripPath } from "../constants/datastore";
import { generateViewTripURL } from "../constants/routes";
import { getModifiedProperties } from "./math";

const handleEditTripSubmit = (values, args) => {
  const modifiedProperties = getModifiedProperties(values, args.initialValues);

  const tripPath = generateTripPath(args.tripId);

  args.datastore.updateDocByPath(tripPath, modifiedProperties);
  args.navigate(generateViewTripURL(args.tripId));
};

export default handleEditTripSubmit;
