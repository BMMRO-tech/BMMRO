import _ from "lodash";

export function processJson(obj) {
  Object.keys(obj).forEach((key) => {
    let replacedKey = replaceSpecialCharacters(key);

    if (key !== replacedKey) {
      obj[replacedKey] = obj[key];
      delete obj[key];
    }
  });
}

function replaceSpecialCharacters(key) {
  let replacedKey = key.trim().replace(" ", "");
  replacedKey = replacedKey.replace("?", "");
  replacedKey = replacedKey.replace("#", "number");
  replacedKey = _.camelCase(replacedKey);
  return replacedKey;
}
