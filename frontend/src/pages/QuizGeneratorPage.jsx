import { useEffect, useMemo, useState } from "react";
import AIProviderSelectField from "../components/dashboard/AIProviderSelectField";
import InlineStatusCard from "../components/dashboard/InlineStatusCard";
import NoteSelectField from "../components/dashboard/NoteSelectField";
import QuizWorkspace from "../components/dashboard/QuizWorkspace";
import { useAI } from "../hooks/useAI";
import { useNotes } from "../hooks/useNotes";

export default function QuizGeneratorPage() {
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
    generateQuiz,
  } = useAI();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const quiz = materialsByNoteId[selectedNoteId]?.quiz || null;

  useEffect(() => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setElapsedSeconds(0);
    setIsSubmitted(false);
  }, [quiz?.id, selectedNoteId]);

  useEffect(() => {
    if (!hasStarted || isSubmitted) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((currentValue) => currentValue + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [hasStarted, isSubmitted]);

  const score = useMemo(() => {
    if (!quiz) {
      return 0;
    }

    return quiz.generatedQuestions.reduce((total, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? total + 1 : total;
    }, 0);
  }, [quiz, selectedAnswers]);

  const handleGenerate = async () => {
    if (!selectedNoteId) {
      showToast("error", "Select a note before generating a quiz.");
      return;
    }

    await generateQuiz(selectedNoteId);
  };

  const isLoading = isLoadingMaterialNoteId === selectedNoteId;
  const isBusy = activeGenerationType === "quiz";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
          Quiz generator
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Create a practice test</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Generate 10 multiple-choice questions from any uploaded note, then take the quiz
          with a timer, progress tracking, and a full review screen.
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
            className="inline-flex w-full items-center justify-center rounded-2xl bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Generating quiz..." : "Generate quiz"}
          </button>

          {aiError ? (
            <InlineStatusCard
              title="Quiz generation unavailable"
              description={aiError}
              tone="error"
              actionLabel="Retry AI"
              onAction={refreshAiActivity}
            />
          ) : null}
        </div>
      </section>

      <QuizWorkspace
        quiz={quiz}
        isLoading={isLoading || isBusy}
        hasStarted={hasStarted}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswers={selectedAnswers}
        elapsedSeconds={elapsedSeconds}
        isSubmitted={isSubmitted}
        score={score}
        onStart={() => setHasStarted(true)}
        onSelectAnswer={(answer) =>
          setSelectedAnswers((currentValue) => ({
            ...currentValue,
            [currentQuestionIndex]: answer,
          }))
        }
        onNext={() => setCurrentQuestionIndex((value) => value + 1)}
        onPrevious={() => setCurrentQuestionIndex((value) => value - 1)}
        onSubmit={() => setIsSubmitted(true)}
        onRestart={() => {
          setHasStarted(true);
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          setElapsedSeconds(0);
          setIsSubmitted(false);
        }}
      />
    </div>
  );
}
