import { useEffect, useState } from "react";
import AIProviderSelectField from "../components/dashboard/AIProviderSelectField";
import FlashcardsWorkspace from "../components/dashboard/FlashcardsWorkspace";
import InlineStatusCard from "../components/dashboard/InlineStatusCard";
import NoteSelectField from "../components/dashboard/NoteSelectField";
import { useAI } from "../hooks/useAI";
import { useNotes } from "../hooks/useNotes";

export default function FlashcardsPage() {
  const { notes, showToast } = useNotes();
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
    generateFlashcards,
  } = useAI();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(true);

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

  const flashcards = materialsByNoteId[selectedNoteId]?.flashcards || null;

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedNoteId, flashcards?.id]);

  const handleGenerate = async () => {
    if (!selectedNoteId) {
      showToast("error", "Select a note before generating flashcards.");
      return;
    }

    await generateFlashcards(selectedNoteId);
  };

  const goToNext = () => {
    setCurrentCardIndex((currentValue) => {
      const nextValue = Math.min(currentValue + 1, flashcards.cards.length - 1);
      return nextValue;
    });
    setIsFlipped(false);
  };

  const goToPrevious = () => {
    setCurrentCardIndex((currentValue) => Math.max(currentValue - 1, 0));
    setIsFlipped(false);
  };

  const isLoading = isLoadingMaterialNoteId === selectedNoteId;
  const isBusy = activeGenerationType === "flashcards";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
          Flashcard generator
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Turn notes into study cards</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Generate a reusable flashcard deck with concise question-and-answer pairs built from
          your uploaded material.
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
            disabled={!selectedNoteId || isBusy}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Generating flashcards..." : "Generate flashcards"}
          </button>

          {aiError ? (
            <InlineStatusCard
              title="Flashcard generation unavailable"
              description={aiError}
              tone="error"
              actionLabel="Retry AI"
              onAction={refreshAiActivity}
            />
          ) : null}
        </div>
      </section>

      <FlashcardsWorkspace
        flashcards={flashcards}
        isLoading={isLoading || isBusy}
        currentCardIndex={currentCardIndex}
        isFlipped={isFlipped}
        studyMode={studyMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onFlip={() => setIsFlipped((currentValue) => !currentValue)}
        onToggleStudyMode={() => setStudyMode((currentValue) => !currentValue)}
        onReset={() => {
          setCurrentCardIndex(0);
          setIsFlipped(false);
        }}
      />
    </div>
  );
}
