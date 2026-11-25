# Deleting Trips

**Status:** Accepted

## Context

Users had no way to remove a trip created in error, such as a duplicate or one created with the wrong details. [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md) and [deleting biopsies](2026-11-17_deleting_biopsies.md) already established how deletion works in the app, so this decision applies the same approach to trips and records where trips differ.

Three things differ from logbook entries and biopsies:

1. Any trip can be deleted. There is no restriction on exported trips or on trips that have ended (issue #662). Logbook entries, by contrast, block deletion once exported or for the trip-end entry.
2. Logbook entries. A trip has a `logbookEntry` subcollection, and the issue requires those entries to be deleted along with the trip. Firestore does not cascade-delete subcollections, and the existing delete only flags the document itself.
3. Trips are a top-level collection. The trips list reads them through `readDocsByTimeRange`, not `readDocsByParentPath`, so the existing datastore filter did not cover them.

## Decision

Trips are soft-deleted. A "Delete trip" button on the trip overview page (`ViewTrip.jsx`) opens the shared `ConfirmationModal`. Confirming flags the trip and all of its logbook entries with `deleted: true` and returns the user to the trips list.

The button is on `ViewTrip.jsx` rather than the edit page because `EditTrip.jsx` redirects exported trips away, and exported trips must also be deletable.

### Cascading to logbook entries

A new datastore method, `softDeleteDocWithSubcollections(path, subcollectionNames)`, reads each named subcollection and sets `deleted: true` on the parent and every child in a single Firestore batch. The batch means the trip and its entries are flagged together or not at all. Like other writes in the app the commit is not awaited, because offline it only resolves once the server confirms it. The batch is queued locally and counts as unsynced until then.

The Firestore client SDK cannot list a document's subcollections, so callers pass the names explicitly (`[CollectionNames.LOGBOOK_ENTRY]` for trips).

Biopsies chose not to cascade to specimens, because the extra writes would make recovery by clearing the flag incomplete. Trips cascade because the issue requires it. The trade-off is the same: a recovery has to clear the flag on the trip and on its entries.

### Filtering

- Lists. `readDocsByTimeRange` (`datastore.js`) now skips documents with `deleted === true`, in the same way as `readDocsByParentPath`, so deleted trips no longer appear in the trips list.
- Direct reads. `readDocByPath` does not filter, so `ViewTrip.jsx`, `EditTrip.jsx` and `NewLogbookEntry.jsx` check `deleted` themselves and redirect to the trips list. This covers someone opening the URL of a deleted trip.
- Export. The export script (`export-script/exportData.js`) reads Firestore directly, so it filters out deleted trips itself. Logbook entries are only queried for trips that pass the filter.

## Consequences

- `readDocsByTimeRange` is also used for encounters. Encounters cannot be deleted yet, so this has no effect on them today, but deleted encounters would be hidden from the encounters list without further changes.
- An entry that was deleted on its own before the trip was deleted cannot be told apart from one that was deleted with the trip. Recovering a trip by clearing every flag would also bring back entries the user deleted on purpose.
- A Firestore batch is limited to 500 writes, so a trip with more than 499 logbook entries cannot be deleted in one batch. Trips have far fewer entries than this in practice.
- Deleted trips and their entries accumulate in Firestore. Tests that create trips must clean them up explicitly.

## Links

- [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md)
- [Deleting biopsies](2026-11-17_deleting_biopsies.md)
- Issue #662 https://github.com/BMMRO-tech/BMMRO/issues/662
