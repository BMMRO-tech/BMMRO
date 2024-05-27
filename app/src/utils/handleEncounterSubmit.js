import { add } from "date-fns";

import { generateEncounterPath } from "../constants/datastore";
import { FormSubmitType, THREE_DAYS_IN_HOURS } from "../constants/forms";
import { generateOpenEncounterURL, ROUTES } from "../constants/routes";
import endEntry from "./endEntry";
import { getModifiedProperties } from "./math";
import { constructDateTime } from "./time";

const handleEditEncounterSubmit = (values, args) => {
  const modifiedProperties = getModifiedProperties(values, args.initialValues);

  const encounterPath = generateEncounterPath(args.encounterId);
  if (args.submitType === FormSubmitType.SAVE_AND_END) {
    const endedEncounter = endEntry(values);
    const endDateTime = constructDateTime(
      endedEncounter.endTimestamp,
      endedEncounter.endTime
    );

    const endDateLimit = add(new Date(endedEncounter.startTimestamp), {
      hours: THREE_DAYS_IN_HOURS,
    });

    if (endDateTime > endDateLimit) {
      args.setAutofillEnd(true);
      args.setShowDateModal(true);
      return;
    }

    args.datastore.updateDocByPath(encounterPath, endEntry(modifiedProperties));
    args.navigate(ROUTES.encounters);
  } else if (args.submitType === FormSubmitType.SAVE) {
    args.datastore.updateDocByPath(encounterPath, modifiedProperties);
    args.navigate(generateOpenEncounterURL(args.encounterId));
  }
};

export default handleEditEncounterSubmit;
