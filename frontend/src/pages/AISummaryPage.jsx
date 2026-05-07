import { useEffect, useMemo, useState } from "react";
import AIProviderSelectField from "../components/dashboard/AIProviderSelectField";
import AISummaryPanel from "../components/dashboard/AISummaryPanel";
import InlineStatusCard from "../components/dashboard/InlineStatusCard";
import NoteSelectField from "../components/dashboard/NoteSelectField";
import { useAI } from "../hooks/useAI";
import { useNotes } from "../hooks/useNotes";
import { downloadPdfDocument, downloadTextDocument } from "../utils/downloads";

const buildSummaryText = (summary) => {
  if (!summary) {
    return "";
  }

  return [
    "StudyVault AI Summary",
    "",
    "Summary",
    summary.summary,
    "",
    "Key Concepts",
    ...summary.keyConcepts.map((item) => `- ${item}`),
    "",
    "Important Points",
    ...summary.importantPoints.map((item) => `- ${item}`),
    "",
    "Exam-Focused Explanation",
    summary.examExplanation,
  ].join("\n");
};

export default function AISummaryPage() {
  const { notes, isLoading: isLoadingNotes, showToast } = useNotes();
  const {
    materialsByNoteId,
    isLoadingMaterialNoteId,
    activeGenerationType,
    aiError,
    selectedProvider,
    selectedOpenRouterModel,
    setSelectedProvider,
    setSelectedOpenRouterModel,
    refreshAiActivity,
    loadNoteMaterials,
    generateSummary,
  } = useAI();
  const [selectedNoteId, setSelectedNoteId] = useState("");

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [selectedNoteId, notes]);

  useEffect(() => {
    if (selectedNoteId) {
      loadNoteMaterials(selectedNoteId).catch(() => {});
    }
  }, [selectedNoteId]);

  const currentSummary = materialsByNoteId[selectedNoteId]?.summary || null;
  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const handleGenerate = async () => {
    if (!selectedNoteId) {
      showToast("error", "Select a note before generating a summary.");
      return;
    }

    await generateSummary(selectedNoteId);
  };

  const handleCopy = async () => {
    if (!currentSummary) {
      return;
    }

    await navigator.clipboard.writeText(buildSummaryText(currentSummary));
    showToast("success", "Summary copied to clipboard.");
  };

  const handleDownloadTxt = () => {
    if (!currentSummary || !selectedNote) {
      return;
    }

    downloadTextDocument({
      filename: `${selectedNote.title.replace(/\s+/g, "-").toLowerCase()}-summary.txt`,
      content: buildSummaryText(currentSummary),
    });
  };

  const handleDownloadPdf = () => {
    if (!currentSummary || !selectedNote) {
      return;
    }

    downloadPdfDocument({
      title: `${selectedNote.title} - AI Summary`,
      filename: `${selectedNote.title.replace(/\s+/g, "-").toLowerCase()}-summary.pdf`,
      sections: [
        { heading: "Summary", body: currentSummary.summary },
        { heading: "Key Concepts", body: currentSummary.keyConcepts.map((item) => `• ${item}`).join("\n") },
        { heading: "Important Points", body: currentSummary.importantPoints.map((item) => `• ${item}`).join("\n") },
        { heading: "Exam-Focused Explanation", body: currentSummary.examExplanation },
      ],
    });
  };

  const isBusy = activeGenerationType === "summary";
  const isLoading = isLoadingMaterialNoteId === selectedNoteId;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Summary generator
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Build a revision sheet</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Select one of your uploaded notes and generate a clean summary with concepts,
          important points, and an exam-focused explanation.
        </p>

        <div className="mt-6 space-y-5">
          <NoteSelectField value={selectedNoteId} onChange={setSelectedNoteId} />
          <AIProviderSelectField
            value={selectedProvider}
            model={selectedOpenRouterModel}
            onChange={setSelectedProvider}
            onModelChange={setSelectedOpenRouterModel}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedNoteId || isBusy || isLoadingNotes}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Generating summary..." : "Generate summary"}
          </button>

          {aiError ? (
            <InlineStatusCard
              title="Summary tools unavailable"
              description={aiError}
              tone="error"
              actionLabel="Retry AI"
              onAction={refreshAiActivity}
            />
          ) : null}
        </div>
      </section>

      <AISummaryPanel
        summary={currentSummary}
        isLoading={isLoading || isBusy}
        onCopy={handleCopy}
        onDownloadTxt={handleDownloadTxt}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
