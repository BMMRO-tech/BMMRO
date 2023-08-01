export const transformStringToBoolean = (encounters) => {
  return JSON.parse(JSON.stringify(encounters), (k, v) =>
    v === "TRUE" ? true : v === "FALSE" ? false : v
  );
};
