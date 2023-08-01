export const transformStringToBoolean = (biopsies) => {
  biopsies.forEach((biopsy) => {
    let nonTargetAnimalBehaviour = JSON.parse(
      JSON.stringify(biopsy.nonTargetAnimalBehaviour),
      (k, v) => (v === "TRUE" ? true : v === "FALSE" ? false : v)
    );
    biopsy.nonTargetAnimalBehaviour = nonTargetAnimalBehaviour;
  });

  return biopsies;
};
