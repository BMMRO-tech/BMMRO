import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";
import convertZeroToNotNoted from "../mappings/convertZeroToNotNoted.js";
import convertNoToNotNoted from "../mappings/convertNoToNotNoted.js";

const transformEncounter = (encounters) => {
    encounters.map((encounter)=> {
        encounter.startTimestamp = convertDateToTimestamp(encounter.startTimestamp);
        encounter.biopsySuccess = convertZeroToNotNoted(encounter.biopsySuccess);
        encounter.tagSuccess = convertNoToNotNoted(encounter.tagSuccess);
    });

    return encounters;
}

export default transformEncounter;
