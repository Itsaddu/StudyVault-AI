import { ArrowLeftIcon, ArrowRightIcon, QuizIcon } from "./Icons";
import ProviderBadge from "./ProviderBadge";

const difficultyTone = {
  easy: "bg-emerald-400/10 text-emerald-200",
  medium: "bg-amber-400/10 text-amber-100",
  hard: "bg-rose-400/10 text-rose-200",
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default function QuizWorkspace({
  quiz,
  isLoading,
  hasStarted,
  currentQuestionIndex,
  selectedAnswers,
  elapsedSeconds,
  isSubmitted,
  score,
  onStart,
  onSelectAnswer,
  onNext,
  onPrevious,
  onSubmit,
  onRestart,
}) {
  const question = quiz?.generatedQuestions?.[currentQuestionIndex];

  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
            Quiz workspace
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">AI MCQ challenge</h3>
          {quiz ? (
            <div className="mt-3">
              <ProviderBadge
                provider={quiz.providerUsed}
                model={quiz.modelUsed}
                fallbackUsed={quiz.fallbackUsed}
              />
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
          Timer: {formatTime(elapsedSeconds)}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <div className="h-10 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/10" />
        </div>
      ) : null}

      {!isLoading && !quiz ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-white">No quiz available yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Generate a quiz from one of your notes to begin a timed practice session.
          </p>
        </div>
      ) : null}

      {!isLoading && quiz && !hasStarted ? (
        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(168,85,247,0.12),_rgba(79,70,229,0.05))] p-6">
          <div className="flex items-center gap-3 text-fuchsia-200">
            <div className="rounded-2xl bg-white/10 p-3">
              <QuizIcon className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold">Ready to start your quiz?</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This quiz contains {quiz.generatedQuestions.length} multiple-choice questions. You can
            navigate freely before submitting, then review the correct answers at the end.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300"
          >
            Start quiz
          </button>
        </div>
      ) : null}

      {!isLoading && quiz && hasStarted && !isSubmitted && question ? (
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              Question {currentQuestionIndex + 1} of {quiz.generatedQuestions.length}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                difficultyTone[question.difficultyLevel.toLowerCase()] || "bg-white/10 text-slate-200"
              }`}
            >
              {question.difficultyLevel}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-fuchsia-400 transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.generatedQuestions.length) * 100}%`,
              }}
            />
          </div>

          <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <p className="text-lg font-semibold leading-8 text-white">{question.question}</p>

            <div className="mt-5 grid gap-3">
              {question.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelectAnswer(option)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                      isSelected
                        ? "border-fuchsia-300 bg-fuchsia-400/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </article>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-fuchsia-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous
            </button>

            <div className="flex flex-wrap gap-3">
              {currentQuestionIndex === quiz.generatedQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300"
                >
                  Submit quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && quiz && isSubmitted ? (
        <div className="mt-6 space-y-5">
          <article className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(217,70,239,0.16),_rgba(168,85,247,0.05))] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-200">Final score</p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {score} / {quiz.generatedQuestions.length}
            </p>
            <p className="mt-2 text-sm text-slate-300">Completed in {formatTime(elapsedSeconds)}</p>
            <button
              type="button"
              onClick={onRestart}
              className="mt-5 inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-fuchsia-300/40 hover:text-white"
            >
              Retake quiz
            </button>
          </article>

          <div className="space-y-4">
            {quiz.generatedQuestions.map((item, index) => {
              const selectedAnswer = selectedAnswers[index];
              const isCorrect = selectedAnswer === item.correctAnswer;

              return (
                <article
                  key={`${item.question}-${index}`}
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <p className="text-base font-semibold leading-7 text-white">{item.question}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        isCorrect
                          ? "bg-emerald-400/10 text-emerald-200"
                          : "bg-rose-400/10 text-rose-200"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Review"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">Your answer: {selectedAnswer || "No answer selected"}</p>
                  <p className="mt-2 text-sm text-emerald-200">Correct answer: {item.correctAnswer}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.explanation}</p>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
