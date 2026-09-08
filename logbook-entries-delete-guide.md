How Entry Creation Works End-to-End

  Before implementing deletion, it helps to understand what creation actually does and why each layer exists.

  The creation flow (logbook entry as the example)

  1. User fills form → NewLogbookEntry.jsx calls datastore.createSubDoc (NewLogbookEntry.jsx:21)

  datastore.createSubDoc(tripPath, CollectionNames.LOGBOOK_ENTRY, values)

  The page component owns only navigation and validation (is the trip real?). It delegates all persistence to datastore. This separation means no page needs to know which
  Firebase API to call.

  2. createSubDoc resolves the path and calls createDoc (datastore.js:143-145)

  createSubDoc(parentPath, subcollectionName, values) {
    return this.createDoc(`${parentPath}/${subcollectionName}`, values);
  }

  This converts "trip parent + collection name" into the full Firestore path trip/{tripId}/logbookEntry/{newId}. All subcollection types (logbook, habitatUse, biopsy,
  specimen) share this same path-building pattern.

  3. createDoc calls docRef.set() fire-and-forget (datastore.js:137-141)

  createDoc(collectionPath, values) {
    const docRef = this.firestore.collection(collectionPath).doc();
    docRef.set(values).catch(this.handleDelayedError);
    return docRef.id;
  }

  .set() returns a promise but the code doesn't await it — it only catches errors with handleDelayedError. This is intentional: Firestore's offline persistence queues the
  write in IndexedDB immediately, so from the user's perspective it "worked" even without a network. The app navigates away before the write confirms.

  4. Firestore's built-in persistence handles offline queuing (datastore.js:152-164)

  enablePersistence() is called once at startup. Firestore stores all pending writes in IndexedDB and replays them when network returns. The app also listens for
  online/offline events to explicitly toggle firestore.enableNetwork() (datastore.js:27-39), which prevents Firestore from blocking on network timeouts when it knows the
  device is offline.

  5. PendingManager watches for unsynced writes (PendingManager.js:32-54)

  For every registered collection, it subscribes to onSnapshot({ includeMetadataChanges: true }) filtered to where("exported", "==", false). For each doc, it checks
  doc.metadata.hasPendingWrites. The total count is surfaced to the UI through pendingCount on FirebaseContext — this is the "unsynced data" indicator users see.

  6. localStorage is not used for entity data

  The clientPersistence.js module only stores the isLoggedIn flag and a date-serialisation helper. All entity data lives in Firestore (and Firestore's IndexedDB cache).
  There is no custom queue to manage.

  ---
  Step-by-Step Guide: Implementing Deletion

  The following steps implement deletion for logbook entries, with callouts showing how each generalises to trips, encounters, habitat use, and biopsy.

  ---
  Step 1 — Add deleteDocByPath to the Datastore class

  File: app/src/datastore/datastore.js

  deleteDocByPath(path) {
    const docRef = this.firestore.doc(path);
    docRef.delete().catch(this.handleDelayedError);
  }

  Why this comes first: Every other operation (create, update, read) is a method on Datastore. The rest of the app never touches the Firebase API directly — it only talks to
   datastore. Adding deletion here means all five entry types get it automatically by passing the appropriate path. The fire-and-forget pattern (no await, catch in
  background) mirrors updateDocByPath exactly, which means offline behaviour is identical: Firestore queues the delete in IndexedDB and replays it when network returns.

  Why not a dedicated deleteSubDoc helper: The path generators in constants/datastore.js (e.g. generateLogbookPath, generateHabitatUsePath) already produce the fully
  qualified path. The edit pages already call generateLogbookPath(tripId, logbookId) and pass that string to updateDocByPath. Using the same path with deleteDocByPath
  requires zero new path logic.

  ---
  Step 2 — Guard against deleting exported records

  Why this must come before any UI work: Once a record is exported (its exported field is true), it has been written to a CSV that the research team has used. Deleting it in
   Firestore would silently diverge the database from the exported artefact, corrupting data integrity with no audit trail. The existing edit flow already blocks changes to
  exported records (EditLogbookEntry.jsx:44-45, EditLogbookEntry.jsx:74). Deletion must follow the same rule.

  The guard is already loaded in every edit page because it reads the document before rendering. Concretely, in EditLogbookEntry.jsx:

  const [isExported, setIsExported] = useState(false);

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);
      if (values.data) {
        setIsExported(values.data.exported); // already here
        setInitialValues(values.data);
      }
    };
    ...
  }, [datastore]);

  The delete button (added in step 4) simply checks isExported before rendering. No new data fetching is required.

  For other types: The same exported field exists on every entity — trips, encounters, habitat uses, biopsies. The pattern is identical across all of them.

  ---
  Step 3 — Guard against deleting the "end of trip" logbook entry

  File: EditLogbookEntry.jsx

  const [hasEnded, setHasEnded] = useState(false);

  // inside getData:
  setHasEnded(values.data.hasEnded);

  Why: When a trip ends, EndTripConfirmationModal creates a logbook entry with hasEnded: true (EndTripConfirmationModal.jsx:44). That sentinel entry is what marks the trip
  as complete. If it is deleted, the trip's logical end disappears, but trip.hasEnded in the parent document remains true — the two records would disagree. This would also
  re-enable the "New logbook entry" button (which SubCollectionList hides when isExported is true but not when entries are missing), creating a subtle state bug.

  The delete button should be disabled or hidden when hasEnded is true.

  Generalisation: Encounters have hasEnded on the encounter document itself (not on child records). Habitat use and biopsy entries do not have a sentinel concept — they can
  be freely deleted (subject only to the exported guard).

  ---
  Step 4 — Build a DeleteConfirmationModal component

  File: app/src/components/DeleteConfirmationModal.jsx

  import { AlertDialogOverlay, AlertDialogLabel, AlertDialogDescription } from "@reach/alert-dialog";
  import { useRef } from "react";
  import Button from "./Button";
  import utilities from "../materials/utilities";

  const DeleteConfirmationModal = ({ entryLabel, onConfirm, onCancel }) => {
    const cancelRef = useRef();

    return (
      <div css={utilities.confirmationModal.overlayBackground}>
        <AlertDialogOverlay
          css={utilities.confirmationModal.overlay}
          leastDestructiveRef={cancelRef}
          data-testid="delete-confirmation-modal"
        >
          <div css={utilities.confirmationModal.modal}>
            <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
              Delete this {entryLabel}?
            </AlertDialogLabel>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
            <div css={utilities.confirmationModal.modalButtons}>
              <Button variant="destructive" onClick={onConfirm}>
                Delete
              </Button>
              <Button variant="neutral" ref={cancelRef} onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </AlertDialogOverlay>
      </div>
    );
  };

  export default DeleteConfirmationModal;

  Why a modal instead of inline confirmation: Every other destructive action in this app uses @reach/alert-dialog (EndTripConfirmationModal, CancelFormConfirmationModal,
  LogoutConfirmationModal). The Reach AlertDialogOverlay sets role="alertdialog" and traps focus, which is the correct ARIA pattern for an action the user cannot undo.
  Consistency also means tests can use the same data-testid pattern as existing modal tests.

  Why leastDestructiveRef points to Cancel: The @reach/alert-dialog spec requires this ref — it sets initial focus on the least dangerous option so keyboard users don't
  accidentally confirm.

  Why entryLabel as a prop: The same modal can display "Delete this logbook entry?", "Delete this habitat use?", "Delete this biopsy?" without duplication.

  Note: A raw ref cannot be passed straight to Button — it's a plain function component, so React will warn "function components cannot be given refs" and
  leastDestructiveRef will silently fail to focus Cancel. The actual implementation wraps Cancel in a small forwardRef component instead.

  ---
  Step 5 — Add delete logic to the edit page

  File: app/src/pages/EditLogbookEntry.jsx

  Add state for the modal and the handler:

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    datastore.deleteDocByPath(logbookPath);
    navigate(generateViewTripURL(tripId));
  };

  Render the delete button (only when the entry is neither exported nor the trip-end sentinel):

  {!isExported && !hasEnded && (
    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
      Delete entry
    </Button>
  )}
  {showDeleteModal && (
    <DeleteConfirmationModal
      entryLabel="logbook entry"
      onConfirm={handleDelete}
      onCancel={() => setShowDeleteModal(false)}
    />
  )}

  Why call deleteDocByPath then navigate immediately (fire-and-forget): This mirrors how createSubDoc and updateDocByPath work in every other page — the UI doesn't wait for
  Firestore to acknowledge. Firestore's offline persistence guarantees the delete will eventually reach the server. Waiting for a promise would also break offline use,
  because docRef.delete() only resolves once the server confirms when you're online.

  Why navigate to the parent trip view: The entry no longer exists, so staying on the edit page would leave the user on a path that reads a deleted document. The parent trip
   view is what EditLogbookEntry already navigates to after a successful update (EditLogbookEntry.jsx:37).

  Why the delete button lives in the edit page rather than the list: The list (SubCollectionList) is a display component — adding destructive actions there would require
  wiring a datastore context call into a component that currently only needs items and parentId. The edit page already has datastore, the full path, and the
  isExported/hasEnded guards loaded.

  Generalisation pattern for other types:

  ┌───────────────┬─────────────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────────┬──────────────────┐
  │     Type      │             Path generator              │           Parent navigation           │          hasEnded guard?          │   Delete from    │
  ├───────────────┼─────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────┼──────────────────┤
  │ Logbook entry │ generateLogbookPath(tripId, logbookId)  │ generateViewTripURL(tripId)           │ Yes, if hasEnded                  │ EditLogbookEntry │
  ├───────────────┼─────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────┼──────────────────┤
  │ Habitat use   │ generateHabitatUsePath(encounterId, id) │ generateOpenEncounterURL(encounterId) │ No                                │ EditHabitatUse   │
  ├───────────────┼─────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────┼──────────────────┤
  │ Biopsy        │ generateBiopsyPath(encounterId, id)     │ generateOpenEncounterURL(encounterId) │ No                                │ EditBiopsy       │
  ├───────────────┼─────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────┼──────────────────┤
  │ Trip          │ generateTripPath(tripId)                │ ROUTES.trips                          │ Check hasEnded + encounters exist │ EditTrip         │
  ├───────────────┼─────────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────┼──────────────────┤
  │ Encounter     │ generateEncounterPath(id)               │ ROUTES.encounters                     │ Check hasEnded + child records    │ EditEncounter    │
  └───────────────┴─────────────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────────┴──────────────────┘

  Trips and encounters need an additional guard: deleting a parent that has children would leave orphaned subcollection documents in Firestore (Firestore does not
  cascade-delete subcollections). Either block deletion when children exist, or implement recursive deletion in deleteDocByPath using the subcollection reading methods
  already on Datastore. Leaf records (logbook, habitat use, biopsy) have no children and need no cascade logic.

  ---
  Step 6 — Handle the pending indicator edge case

  Why this matters: PendingManager tracks hasPendingWrites by listening to docs that match where("exported", "==", false). A document that has been deleted (even pending
  deletion while offline) disappears from that query immediately — Firestore applies the deletion optimistically in the local cache. This means pending deletes are invisible
   to the pendingCount indicator.

  For writes and updates this is fine — you created the entry, you want the pending count to show it hasn't synced. For deletions, the entry vanishes from the snapshot the
  moment you delete it, whether or not the delete has reached the server.

  Decision: This is an acceptable gap for the current implementation, for two reasons:
  1. A pending delete is a safe pending operation — the worst case is a deleted entry reappearing temporarily if the delete never syncs (e.g., the user is offline and closes
   the app before it syncs). That is a recoverable situation.
  2. Fixing it would require the PendingManager to track docChanges with type === "removed" and maintain a separate set of pending-deletion IDs — a meaningful complexity
  increase for a minor UX improvement.

  Document this limitation with a code comment on PendingManager._addCollectionListener so the next person doesn't rediscover it.

  ---
  Step 7 — Add a DatastoreErrorType for delete failures

  File: app/src/constants/datastore.js

  export const DatastoreErrorType = {
    // existing entries...
    DOCUMENT_DELETE: "document-delete",
  };

  Why: Every other operation has a named error type (COLLECTION_READ, DOCUMENT_UPDATE, etc.). When deleteDocByPath's .catch(handleDelayedError) fires, having a named type
  lets test stubs and error-boundary logic distinguish delete failures from update failures. Without a named type, a failing delete looks identical to a failing update in
  error logs.

  Note: this belongs in constants/datastore.js only, merged into the existing DatastoreErrorType object there. Pasting a second export const DatastoreErrorType into
  datastore/datastore.js (which already imports DatastoreErrorType from constants/datastore.js) creates a duplicate identifier and breaks the build.

  ---
  Step 8 — Write tests in the same structure as existing ones

  Each create or update operation has a corresponding test file (e.g. NewLogbookEntry.test.jsx, EditLogbookEntry.test.jsx). For deletion, add to the existing edit test file:

  describe("delete logbook entry", () => {
    it("shows delete button when entry is not exported and not hasEnded")
    it("hides delete button when entry is exported")
    it("hides delete button when entry has hasEnded")
    it("shows confirmation modal when delete button clicked")
    it("calls deleteDocByPath with correct path on confirm")
    it("navigates to trip view after confirm")
    it("does not call deleteDocByPath when cancelled")
  })

  Why tests target the modal interaction, not just the function call: The modal is a safety mechanism. A test that only checks datastore.deleteDocByPath.toHaveBeenCalled
  would not catch a regression where the modal is bypassed and the entry is deleted immediately on button click.

  ---
  Summary of what you're not adding

  - No new route — deletion happens in the existing edit page, not a dedicated /delete URL
  - No localStorage changes — entity data has never been in localStorage
  - No new context — datastore from FirebaseContext is sufficient
  - Effectively no changes to PendingManager — Step 6 adds a code comment there to document the pending-delete gap, but there is no behavioural change; offline queuing of
    deletes is otherwise handled by Firestore's persistence layer, same as for writes

  The entire implementation reduces to: one method on Datastore, one modal component, and ~25 lines of state + JSX per edit page — each using patterns that already exist in
  the codebase.
