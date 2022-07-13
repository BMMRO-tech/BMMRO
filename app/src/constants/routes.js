export const ROUTES = {
  encounters: "/encounters",
  newEncounter: "/encounters/new",
  openEncounter: "/encounters/:encounterId/habitat-uses",
  editEncounter: "/encounters/:encounterId/edit",
  viewEncounter: "/encounters/:encounterId/view",
  newHabitatUse: "/encounters/:encounterId/habitat-uses/new",
  editHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/edit",
  viewHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/view",
  newBiopsy: "/encounters/:encounterId/biopsies/new",
  editBiopsy: "/encounters/:encounterId/biopsies/:biopsyId/edit",
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

export const generateNewBiopsyURL = (encounterId) => {
  return `/encounters/${encounterId}/biopsies/new`;
};

export const generateEditBiopsyURL = (encounterId, biopsyId) => {
  return `/encounters/${encounterId}/biopsies/${biopsyId}/edit`;
};
