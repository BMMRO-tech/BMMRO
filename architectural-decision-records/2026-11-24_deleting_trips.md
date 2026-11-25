# Deleting Trips

**Status:** Accepted

## Context

Users had no way to remove a trip created in error, such as a duplicate or one created with the wrong details. [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md) already set out how deletion works in the app, so this follows the same approach.

Trips differ from logbook entries in two ways:

- 1) Any trip can be deleted. Unlike logbook entries, there is no restriction on exported trips or trips that have ended (issue #662).
- 2) Trips have child records. Each trip has a `logbookEntry` subcollection, and these need to be deleted along with the trip. Firestore does not cascade-delete subcollections.

## Decision

Trips are soft-deleted. A "Delete trip" button on the trip overview page (`ViewTrip.jsx`) opens the shared `ConfirmationModal`, and confirming sets `deleted: true` on the trip and all of its logbook entries. The button is on `ViewTrip.jsx` rather than the edit page because `EditTrip.jsx` redirects exported trips away.

The trip and its entries are updated in a single Firestore batch via a new datastore method, `softDeleteDocWithSubcollections`, so either everything is flagged or nothing is. Subcollection names are passed in because the Firestore client SDK can't list them.

Deleted trips are filtered out on read:

- `readDocsByTimeRange` (`datastore.js`) now skips `deleted === true` documents, so deleted trips don't show in the trips list.
- `ViewTrip.jsx`, `EditTrip.jsx` and `NewLogbookEntry.jsx` read the trip with `readDocByPath`, which doesn't filter, so they check `deleted` themselves and redirect to the trips list.
- `export-script/exportData.js` filters out deleted trips itself, so their logbook entries are never exported.

We chose soft delete for the same reasons as logbook entries: a mistaken delete can be recovered by clearing the flag, and it's an ordinary write, so it works offline and shows in the "unsynced changes" indicator until it syncs.

## Consequences

- `readDocsByTimeRange` is also used for encounters, so deleted encounters would be hidden too if encounter deletion is added later.
- A logbook entry deleted on its own can't be told apart from one deleted with its trip, so restoring a trip by clearing every flag would also bring back entries that were deleted on purpose.
- A Firestore batch is limited to 500 writes, so a trip with more than 499 logbook entries can't be deleted in one go.
- Deleted trips and entries stay in Firestore; tests that create them must clean them up explicitly.

## Links

- [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md)
- Issue #662 https://github.com/BMMRO-tech/BMMRO/issues/662
