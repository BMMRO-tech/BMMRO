export const ROUTES = {
  newEncounter: "/encounters/new",
  openEncounter: "/encounters/:encounterId/habitat-uses",
  editEncounter: "/encounters/:encounterId/edit",
  newHabitatUse: "/encounters/:encounterId/habitat-uses/new",
  editHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/edit",
  login: "/login",
};

export const generateOpenEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses`;
};

export const generateEditEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/edit`;
};

export const generateNewHabitatUseURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses/new`;
};

export const generateEditHabitatURL = (encounterId, habitatUseId) => {
  return `/encounters/${encounterId}/habitat-uses/${habitatUseId}/edit`;
};
