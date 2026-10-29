# Deleting Logbook Entries

**Status:** Accepted

## Context

Users had no way to remove a logbook entry created in error, such as a duplicate or one added to the wrong trip.

Two existing rules limit which entries can be deleted:

- **Exported entries.** Once an entry's `exported` field is `true`, it has been written to a CSV the research team uses. Editing is already blocked for exported entries, and deletion follows the same rule so Firestore doesn't diverge from the exported data.
- **The trip-end entry.** Ending a trip creates a logbook entry with `hasEnded: true` (`EndTripConfirmationModal.jsx`). Deleting it would leave the trip marked as ended with no matching entry, and would re-enable "New logbook entry" on a closed trip.

## Decision

Logbook entries are soft-deleted. A "Delete logbook entry" button on the edit page (`EditLogbookEntry.jsx`) opens a confirmation modal, and confirming sets `deleted: true` on the entry via `updateDocByPath`. The button is only shown when the entry is neither exported nor the trip-end entry.

The document stays in Firestore. Code that reads logbook entries filters out `deleted === true`; currently that is `ViewTrip.jsx` and `export-script/exportData.js`.

We chose soft delete over removing the document because:

- A mistaken delete can be recovered by clearing the flag.
- It is an ordinary update, so it works offline like every other write and is counted by the "unsynced changes" indicator until it syncs. A real Firestore delete disappears from the local cache immediately and would never show as pending.

The confirmation modal (`DeleteConfirmationModal`) uses `@reach/alert-dialog`, like the app's other confirmation modals, with focus defaulting to Cancel.

## Consequences

- Any new code that reads logbook entries (UI, export or scripts) must filter out `deleted` entries, or they will reappear.
- Deleted entries accumulate in Firestore. Firestore does not cascade-delete subcollections, so they are not removed when a trip is deleted; tests that create entries must clean them up explicitly.
- Only logbook entries can be deleted. Extending this to habitat use, biopsy, trip or encounter records is a separate piece of work.

## Links

- Issue #657 https://github.com/BMMRO-tech/BMMRO/issues/657
