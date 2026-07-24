const SKIN = "Skin";
const SKIN_AND_BLUBBER = "Skin & blubber";

const convertSkinToBool = (skinOrSkinAndBlubInput) =>
  skinOrSkinAndBlubInput === SKIN || skinOrSkinAndBlubInput === SKIN_AND_BLUBBER
    ? true
    : false;

export default convertSkinToBool;
