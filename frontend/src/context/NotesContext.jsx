import { createContext, useEffect, useMemo, useState } from "react";
import { notesApi } from "../services/api";

const defaultStats = {
  totalNotes: 0,
  totalStorageBytes: 0,
  uploadsThisWeek: 0,
  uniqueFileTypes: 0,
};

export const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFetchingSelectedNote, setIsFetchingSelectedNote] = useState(false);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState("");
  const [toasts, setToasts] = useState([]);
  const [notesError, setNotesError] = useState("");

  const showToast = (type, message) => {
    const toastId = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;

    setToasts((currentToasts) => [...currentToasts, { id: toastId, type, message }]);

    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
    }, 3200);
  };

  const fetchNotes = async () => {
    setIsLoading(true);

    try {
      const response = await notesApi.getNotes();
      setNotes(response.notes);
      setStats(response.stats);
      setNotesError("");
    } catch (error) {
      setNotesError(error.message);
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(query) ||
        note.originalFileName.toLowerCase().includes(query) ||
        note.extractedTextPreview.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery]);

  const recentNotes = useMemo(() => filteredNotes.slice(0, 5), [filteredNotes]);

  const uploadNote = async ({ title, file }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await notesApi.uploadNote(formData, (progressEvent) => {
        if (!progressEvent.total) {
          return;
        }

        setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      });

      await fetchNotes();
      showToast("success", "Note uploaded successfully.");
      return response.note;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const openNote = async (noteId) => {
    setIsFetchingSelectedNote(true);

    try {
      const response = await notesApi.getNoteById(noteId);
      setSelectedNote(response.note);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsFetchingSelectedNote(false);
    }
  };

  const closeSelectedNote = () => {
    setSelectedNote(null);
  };

  const deleteNote = async (noteId) => {
    setIsDeletingNoteId(noteId);

    try {
      await notesApi.deleteNote(noteId);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      await fetchNotes();
      showToast("success", "Note deleted successfully.");
    } catch (error) {
      showToast("error", error.message);
      throw error;
    } finally {
      setIsDeletingNoteId("");
    }
  };

  const value = {
    notes,
    stats,
    searchQuery,
    selectedNote,
    isLoading,
    isUploading,
    uploadProgress,
    isFetchingSelectedNote,
    isDeletingNoteId,
    toasts,
    notesError,
    filteredNotes,
    recentNotes,
    showToast,
    setSearchQuery,
    fetchNotes,
    uploadNote,
    openNote,
    closeSelectedNote,
    deleteNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
