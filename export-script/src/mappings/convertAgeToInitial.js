const convertAgeToInitial = (ageInput) => {
    if (ageInput === "calf") {
        return 'C'
    } else if (ageInput === "juvenile") {
        return 'J'
    } else if (ageInput === "subadult") {
        return 'SA'
    } else if (ageInput === "Adult") {
        return 'A'
    } else if (ageInput === "unknown") {
        return 'U'
    }
 }

 module.exports = convertAgeToInitial;