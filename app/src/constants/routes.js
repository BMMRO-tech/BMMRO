export const ROUTES = {
  encounters: "/encounters",
  newEncounter: "/encounters/new",
  openEncounter: "/encounters/:encounterId/habitat-uses",
  editEncounter: "/encounters/:encounterId/edit",
  viewEncounter: "/encounters/:encounterId/view",
  newHabitatUse: "/encounters/:encounterId/habitat-uses/new",
  editHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/edit",
  viewHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/view",
  newBiopsyForm: "/encounters/:encounterId/biopsies/new",
  login: "/login",
};

export const generateOpenEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses`;
};

export const generateEditEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/edit`;
};

export const generateViewEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/view`;
};

export const generateNewHabitatUseURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses/new`;
};

export const generateEditHabitatURL = (encounterId, habitatUseId) => {
  return `/encounters/${encounterId}/habitat-uses/${habitatUseId}/edit`;
};

export const generateViewHabitatURL = (encounterId, habitatUseId) => {
  return `/encounters/${encounterId}/habitat-uses/${habitatUseId}/view`;
};
export const generateNewBiopsiesURL = (encounterId) => {
  return `/encounters/${encounterId}/biopsies/new`;
};
