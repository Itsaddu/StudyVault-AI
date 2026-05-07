import InlineStatusCard from "../components/dashboard/InlineStatusCard";
import RecentUploadsList from "../components/dashboard/RecentUploadsList";
import SelectedNotePanel from "../components/dashboard/SelectedNotePanel";
import { useNotes } from "../hooks/useNotes";

export default function NotesPage() {
  const {
    filteredNotes,
    selectedNote,
    isLoading,
    notesError,
    isFetchingSelectedNote,
    isDeletingNoteId,
    openNote,
    closeSelectedNote,
    deleteNote,
    fetchNotes,
  } = useNotes();

  return (
    <div className="space-y-6">
      {notesError ? (
        <InlineStatusCard
          title="Notes list unavailable"
          description={notesError}
          tone="error"
          actionLabel="Retry"
          onAction={fetchNotes}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentUploadsList
          notes={filteredNotes}
          isLoading={isLoading}
          onOpen={openNote}
          onDelete={deleteNote}
          deletingNoteId={isDeletingNoteId}
          title="All uploaded notes"
        />

        <SelectedNotePanel
          note={selectedNote}
          isLoading={isFetchingSelectedNote}
          onClose={closeSelectedNote}
        />
      </div>
    </div>
  );
}
