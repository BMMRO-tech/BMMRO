const convertSexToInitials = (sexInput) => {
    switch(sexInput) {
        case "male":
        return "M"
        case "female":
        return "F"
        case "unknown":
        return "U"
        default:
        return ""
    }
};

module.exports = convertSexToInitials;
