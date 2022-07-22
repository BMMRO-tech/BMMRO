

const convertSexToInitials = (sexInput) => {

    let sexInitial = "";

    if (sexInput === "male"){
        return sexInitial="M"
    } else if (sexInput === "female"){
        return sexInitial="F"
    }
    return sexInitial="U"


};

module.exports = convertSexToInitials;
