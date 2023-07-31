import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";

export const transformBiopsy = (biopsies) => {
    biopsies.map((biopsy)=> {
        biopsy.dateTaken = convertDateToTimestamp(biopsy.dateTaken);
    })

    return biopsies;
}

export const seperateAnimalBehaviourJson = (biopsies) => {
    const nonTargetAnimalBehaviour = {}
    biopsies.map((biopsy)=> {
        nonTargetAnimalBehaviour.shake = biopsy['nonTargetAnimalBehaviour.shake'];
        nonTargetAnimalBehaviour.startle = biopsy["nonTargetAnimalBehaviour.startle"]
        nonTargetAnimalBehaviour.tailSplash = biopsy["nonTargetAnimalBehaviour.tailSplash"]
        nonTargetAnimalBehaviour.tailSlap = biopsy["nonTargetAnimalBehaviour.tailSlap"]
        nonTargetAnimalBehaviour.lunge = biopsy["nonTargetAnimalBehaviour.lunge"]
        nonTargetAnimalBehaviour.breach = biopsy["nonTargetAnimalBehaviour.breach"]
        nonTargetAnimalBehaviour.accelerated = biopsy["nonTargetAnimalBehaviour.accelerated"]
        nonTargetAnimalBehaviour.dive = biopsy["nonTargetAnimalBehaviour.dive"]
        nonTargetAnimalBehaviour.porpoising = biopsy["nonTargetAnimalBehaviour.porpoising"]
        nonTargetAnimalBehaviour.flight = biopsy["nonTargetAnimalBehaviour.flight"]
        nonTargetAnimalBehaviour.prolongedFlight = biopsy["nonTargetAnimalBehaviour.prolongedFlight"]
        nonTargetAnimalBehaviour.directionChange = biopsy["nonTargetAnimalBehaviour.directionChange"]
        biopsy.nonTargetAnimalBehaviour = nonTargetAnimalBehaviour;

        for (const key in biopsy) {
            if (key.startsWith("nonTargetAnimalBehaviour.")) {
                delete biopsy[key];
            }
        }
    })
    return biopsies;
}

export default {transformBiopsy, seperateAnimalBehaviourJson};
