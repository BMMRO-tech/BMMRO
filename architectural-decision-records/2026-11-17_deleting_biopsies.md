# Deleting Biopsies

**Status:** Accepted

## Context

Users had no way to remove a biopsy created in error, such as a duplicate or one added to the wrong encounter. [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md) already established how deletion works in the app, so this decision applies the same approach to biopsies and records where biopsies differ.

Two things differ from logbook entries:

1. No equivalent of the trip-end entry. A logbook entry can be created by another action (ending a trip), which makes deleting it unsafe. A biopsy is only created by the user, and no other record in the encounter depends on it.
2. Specimens. A biopsy has a `specimen` subcollection. Firestore does not cascade-delete subcollections, so the specimens of a deleted biopsy are left in place.

## Decision

Biopsies are soft-deleted, in the same way as logbook entries. A "Delete biopsy" button in the header of the edit page (`EditBiopsy.jsx`) opens a confirmation modal (the shared `ConfirmationModal`). Confirming sets `deleted: true` on the biopsy via `updateDocByPath` and returns the user to the encounter overview.

The document stays in Firestore and is filtered out on read:

- Lists. The encounter overview reads biopsies through `readDocsByParentPath` (`datastore.js`), which already excludes `deleted === true` entries, so no change was needed there.
- Direct reads. `readDocByPath` does not filter, so `EditBiopsy.jsx` checks `deleted` itself and redirects to the encounter overview, in the same way as when no biopsy exists for the ID. This covers someone opening the edit URL of a deleted biopsy.
- Export. The export script (`export-script/exportData.js`) reads Firestore directly, so it filters out deleted biopsies itself, as it already does for logbook entries. Specimens are only queried for biopsies that pass the filter, so the specimens of a deleted biopsy are not exported either. Deleted biopsies are never marked as exported, so they keep `exported: false`.

We chose soft delete over removing the document for the same reasons as logbook entries: a mistaken delete can be recovered by clearing the flag, and it is an ordinary update, so it works offline and is counted by the "unsynced changes" indicator until it syncs.

We chose not to delete the specimens when a biopsy is deleted. The extra writes would need to be batched with the biopsy update and would make a recovery by clearing the flag incomplete. The app only reads specimens through their parent biopsy, so they are not visible once it is filtered out. Anything that queries specimens directly (for example a collection-group query) would still return them and must check the parent biopsy.

## Consequences

- Any reader that bypasses `readDocsByParentPath` must filter out `deleted` biopsies itself. `readDocByPath` is one (`EditBiopsy.jsx` handles it). `ViewBiopsy.jsx` checks `deleted` and redirects to the encounter overview, in the same way as `EditBiopsy.jsx`.

## Links

- [Deleting logbook entries](2026-09-08_deleting_logbook_entries.md)
- Issue #703 https://github.com/BMMRO-tech/BMMRO/issues/703
