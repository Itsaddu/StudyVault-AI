import { ArrowLeftIcon, ArrowRightIcon, CardStackIcon } from "./Icons";
import ProviderBadge from "./ProviderBadge";

export default function FlashcardsWorkspace({
  flashcards,
  isLoading,
  currentCardIndex,
  isFlipped,
  studyMode,
  onPrevious,
  onNext,
  onFlip,
  onToggleStudyMode,
  onReset,
}) {
  const currentCard = flashcards?.cards?.[currentCardIndex];

  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
            Flashcard deck
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Interactive study mode</h3>
          {flashcards ? (
            <div className="mt-3">
              <ProviderBadge
                provider={flashcards.providerUsed}
                model={flashcards.modelUsed}
                fallbackUsed={flashcards.fallbackUsed}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onToggleStudyMode}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              studyMode
                ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
                : "border-white/10 text-slate-200 hover:border-amber-300/40 hover:text-white"
            }`}
          >
            {studyMode ? "Study mode on" : "Study mode off"}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={!flashcards}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset deck
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 h-[360px] animate-pulse rounded-[1.8rem] bg-white/10" />
      ) : null}

      {!isLoading && !flashcards ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-white">No flashcards generated yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Generate an AI flashcard deck from a note to begin studying with interactive cards.
          </p>
        </div>
      ) : null}

      {!isLoading && flashcards && currentCard ? (
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              Card {currentCardIndex + 1} of {flashcards.cards.length}
            </p>
            <div className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              {studyMode ? "Study mode" : "Browse mode"}
            </div>
          </div>

          <button
            type="button"
            onClick={studyMode ? onFlip : undefined}
            className="[perspective:1400px] block w-full text-left"
          >
            <div
              className={`relative h-[360px] rounded-[1.8rem] transition duration-500 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(251,191,36,0.14),_rgba(249,115,22,0.06))] p-8 [backface-visibility:hidden]">
                <div className="flex items-center gap-3 text-amber-100">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <CardStackIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">Question</p>
                </div>
                <p className="mt-10 text-3xl font-semibold leading-tight text-white">
                  {currentCard.question}
                </p>
                <p className="mt-10 text-sm text-slate-300">
                  {studyMode
                    ? "Tap the card to reveal the answer."
                    : "Browse mode keeps the answer visible below the card."}
                </p>
              </div>

              <div className="absolute inset-0 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(34,211,238,0.14),_rgba(14,165,233,0.06))] p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Answer
                </p>
                <p className="mt-10 whitespace-pre-wrap text-xl leading-9 text-white">
                  {currentCard.answer}
                </p>
              </div>
            </div>
          </button>

          {!studyMode ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-cyan-400/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Answer preview
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {currentCard.answer}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={currentCardIndex === 0}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={currentCardIndex === flashcards.cards.length - 1}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
