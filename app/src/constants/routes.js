export const ROUTES = {
  encounters: "/encounters",
  trips: "/trips",
  project: "/project",
  newEncounter: "/encounters/new",
  newTrip: "/trips/new",
  viewTrip: "/trips/:tripId/view",
  newLogbookEntry: "/trips/:tripId/logbook-entry/new",
  openEncounter: "/encounters/:encounterId/habitat-uses",
  openTrip: "/trips/:tripId/logbook-entry",
  editEncounter: "/encounters/:encounterId/edit",
  viewEncounter: "/encounters/:encounterId/view",
  newHabitatUse: "/encounters/:encounterId/habitat-uses/new",
  editHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/edit",
  viewHabitatUse: "/encounters/:encounterId/habitat-uses/:habitatUseId/view",
  newBiopsy: "/encounters/:encounterId/biopsies/new",
  editBiopsy: "/encounters/:encounterId/biopsies/:biopsyId/edit",
  viewBiopsy: "/encounters/:encounterId/biopsies/:biopsyId/view",
  notFound: "/404",
  login: "/login",
};

export const generateOpenEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses`;
};

export const generateOpenTripURL = (tripId) => {
  return `/trips/${tripId}/logbook-entry`;
};

export const generateEditEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/edit`;
};

export const generateViewTripURL = (tripId) => {
  return `/trips/${tripId}/view`;
};

export const generateEditTripURL = (tripId) => {
  return `/trips/${tripId}/edit`;
};

export const generateViewEncounterURL = (encounterId) => {
  return `/encounters/${encounterId}/view`;
};
export const generateViewProjectURL = (projectId) => {
  return `/project/${projectId}`;
};

export const generateNewHabitatUseURL = (encounterId) => {
  return `/encounters/${encounterId}/habitat-uses/new`;
};

export const generateNewLogbookEntryURL = (tripId) => {
  return `/trips/${tripId}/logbook-entry/new`;
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

export const generateViewBiopsyURL = (encounterId, biopsyId) => {
  return `/encounters/${encounterId}/biopsies/${biopsyId}/view`;
};

// export const generateViewLogbookEntryURL = (tripId, logbookId) => {
//   return `/trips/${tripId}/logbook-entry/${logbookId}/view`;
// };

// export const generateEditLogbookEntryURL = (tripId, logbookId) => {
//   return `/trips/${tripId}/logbook-entry/${logbookId}/edit`;
// };
