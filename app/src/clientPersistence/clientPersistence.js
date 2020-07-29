import { parse } from "date-fns";
const LOCALE_STRING_FORMAT = "dd/MM/yyyy, HH:mm:ss";

const convertLocaleStringToDate = (dateString) => {
  return parse(dateString, LOCALE_STRING_FORMAT, new Date());
};

const clientPersistence = {
  get(key) {
    let value = localStorage.getItem(key);
    const isValidDate = value && value.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}.+/);

    if (isValidDate) {
      value = convertLocaleStringToDate(value);
    }

    return value;
  },
  set(key, value) {
    if (value instanceof Date) {
      value = value.toLocaleString();
    }
    return localStorage.setItem(key, value);
  },
  remove(key) {
    return localStorage.removeItem(key);
  },
};

export default clientPersistence;
