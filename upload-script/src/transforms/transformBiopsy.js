import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";

const transformBiopsy = (biopsies) => {
    biopsies.map((biopsy)=> {
        biopsy.dateTaken = convertDateToTimestamp(biopsy.dateTaken);
    })

    return biopsies;
}

export default transformBiopsy;
