export const ROUTES = {
  newEncounter: "/encounters/new",
  openEncounter: "/encounters/:encounterId/habitat-uses",
  newHabitatUse: "/encounters/:encounterId/habitat-uses/new",
  editHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/edit",
  login: "/login",
};

export const generateOpenEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses`;
};

export const generateNewHabitatUseURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses/new`;
};

export const generateEditHabitatURL = (encounterId, habitatUseId) => {
  return `/encounters/${encounterId}/habitat-uses/${habitatUseId}/edit`;
};
