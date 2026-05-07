import { SearchIcon } from "./Icons";
import { useNotes } from "../../hooks/useNotes";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNotes();

  return (
    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-inner shadow-black/10 transition duration-300 focus-within:border-cyan-300/40 focus-within:bg-white/[0.07]">
      <SearchIcon className="h-5 w-5 text-slate-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search notes by title, file name, or extracted text..."
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
    </label>
  );
}
