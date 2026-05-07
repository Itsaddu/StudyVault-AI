import { useNotes } from "../../hooks/useNotes";

export default function NoteSelectField({ value, onChange, label = "Select note" }) {
  const { notes, isLoading } = useNotes();

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="note-selector">
        {label}
      </label>
      <select
        id="note-selector"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading || notes.length === 0}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">
          {isLoading ? "Loading notes..." : notes.length === 0 ? "No notes available" : "Choose a note"}
        </option>
        {notes.map((note) => (
          <option key={note.id} value={note.id}>
            {note.title}
          </option>
        ))}
      </select>
    </div>
  );
}

