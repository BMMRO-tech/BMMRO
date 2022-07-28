const convertAgeToInitial = (ageInput) => {
    switch(ageInput) {
        case "calf":
        return "C"
        case "juvenile":
        return "J"
        case "subadult":
        return "SA"
        case "Adult":
        return "A"
        case "unknown":
        return "U"
        default:
        return ""
    }
 }

 module.exports = convertAgeToInitial;