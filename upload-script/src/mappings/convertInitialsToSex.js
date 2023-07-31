const convertInitialsToSex = (sexInput) => {
    switch(sexInput) {
        case "M":
        return "male"
        case "F":
        return "female"
        case "U":
        return "unknown"
        default:
        return ""
    }
};

module.exports = convertInitialsToSex;
