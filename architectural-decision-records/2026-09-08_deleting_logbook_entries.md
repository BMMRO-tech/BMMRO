# Deleting Logbook Entries

**Status:** Accepted

## Context

Users had no way to remove a logbook entry that was created in error — for example a duplicate entry, or one started for the wrong trip. The app already supports creating and editing logbook entries via `Datastore`, but had no delete capability at any layer (no `Datastore` method, no UI).

Two existing constraints shape what "delete" is allowed to mean here:

- **Exported records.** Once a logbook entry's `exported` field is `true`, it has already been written to a CSV the research team uses. Editing is already blocked for exported entries (`EditLogbookEntry.jsx`); deletion needs to follow the same rule, otherwise Firestore would silently diverge from the exported artefact with no audit trail.
- **The trip-end sentinel entry.** Ending a trip creates a logbook entry with `hasEnded: true` (`EndTripConfirmationModal.jsx`). That entry is what marks the trip as complete. Deleting it would leave `trip.hasEnded` on the parent document out of sync with the child records, and would re-enable "New logbook entry" on a trip that should be closed.

## Decision

Add a `deleteDocByPath(path)` method to `Datastore`, and surface it through a "Delete entry" button and confirmation modal on the existing edit page (`EditLogbookEntry.jsx`), gated by the two constraints above.

`deleteDocByPath` mirrors the existing `updateDocByPath`: it resolves the fully-qualified document path and calls `docRef.delete()` fire-and-forget (not awaited, errors caught via `handleDelayedError`). This keeps the delete behaviour consistent with every other write in the app — Firestore's offline persistence queues it in IndexedDB and replays it once the network returns, so the UI doesn't block waiting for a server round-trip.

The `isExported` and `hasEnded` values are already fetched by the edit page's existing `readDocByPath` call (they were already needed to disable editing / show the "exported" notice), so no new data fetching was required — the delete button simply renders only when `!isExported && !hasEnded`.

### Alternatives considered

**Await the delete vs. fire-and-forget.** Awaiting `docRef.delete()` would only resolve once the server confirms, which breaks offline use — the app is used at sea with no connectivity. We kept the same fire-and-forget pattern used by `createDoc` and `updateDocByPath`.

**Inline confirmation vs. a modal.** Every other destructive action in the app (logout, ending a trip, cancelling a form) already uses a `@reach/alert-dialog`-based confirmation modal, which sets `role="alertdialog"`, traps focus, and defaults focus to the least-destructive option (Cancel). We built a reusable `DeleteConfirmationModal` component following the same pattern instead of a simpler inline confirmation, for accessibility and UI consistency.

**Delete button on the edit page vs. the entry list.** The list (`SubCollectionList`) is a presentational component that currently only needs `items` and `parentId`. Putting the delete action there would mean wiring a `datastore` context call into a component that doesn't otherwise need one. The edit page already has `datastore`, the full document path, and the `isExported`/`hasEnded` guards loaded, so it was the natural place for the action to live.

**Fixing vs. accepting the pending-delete gap.** Firestore applies a delete to the local cache optimistically, so a deleted document disappears from `PendingManager`'s snapshot listener immediately — before the delete has actually reached the server. This means the app's "unsynced changes" counter (`pendingCount`) never reflects a pending delete. Properly fixing this would mean `PendingManager` tracking `docChanges` of `type === "removed"` and maintaining a separate pending-deletion set. We decided this was not worth the added complexity: the worst case is a deleted entry reappearing if the delete never syncs (e.g. offline, app closed before reconnecting), which is recoverable. This is documented with a code comment on `PendingManager._addCollectionListener` rather than fixed.

## Consequences

- A `DatastoreErrorType.DOCUMENT_DELETE` entry was added alongside the existing error types, so a failing delete can eventually be distinguished from a failing update in error logs/tests, consistent with how every other `Datastore` operation is typed.
- Pending deletes are invisible to the "unsynced changes" indicator (see above) — an accepted, documented limitation rather than a bug.
- No new route, no `localStorage` changes, and no new React context were needed — deletion reuses the existing edit page, Firestore's existing offline persistence, and the `datastore` already exposed via `FirebaseContext`.
- The same pattern (path generator + parent-navigation target + optional `hasEnded`/child-record guard) is expected to generalise to habitat use, biopsy, trip, and encounter records, but only logbook entries were implemented and tested here. Extending deletion to other entity types is out of scope for this decision and should be its own follow-up.

## Links

- [Implementation guide](../logbook-entries-delete-guide.md) — step-by-step breakdown of the implementation with file/line references
- Issue #657 (inferred from branch name `feature/657-delete-logbook-entries` — confirm/replace with the actual issue link)
