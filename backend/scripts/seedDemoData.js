import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { Flashcard } from "../src/models/flashcard.model.js";
import { Note } from "../src/models/note.model.js";
import { Quiz } from "../src/models/quiz.model.js";
import { Summary } from "../src/models/summary.model.js";
import { User } from "../src/models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demoDir = path.resolve(__dirname, "../demo");

const createDemoArtifacts = async (user) => {
  const files = [
    {
      title: "Computer Networks Revision",
      originalFileName: "computer-networks.txt",
      mimeType: "text/plain",
    },
    {
      title: "Database Systems Revision",
      originalFileName: "database-systems.txt",
      mimeType: "text/plain",
    },
  ];

  for (const file of files) {
    const extractedText = await fs.readFile(path.join(demoDir, file.originalFileName), "utf-8");
    const existingNote = await Note.findOne({
      uploadedBy: user._id,
      originalFileName: file.originalFileName,
    });

    const note =
      existingNote ||
      (await Note.create({
        title: file.title,
        originalFileName: file.originalFileName,
        uploadedBy: user._id,
        extractedText,
        uploadDate: new Date(),
        filePath: path.join(env.uploadDir, "demo", file.originalFileName),
        fileSize: Buffer.byteLength(extractedText, "utf-8"),
        mimeType: file.mimeType,
      }));

    const existingSummary = await Summary.findOne({ userId: user._id, noteId: note._id });

    if (!existingSummary) {
      await Summary.create({
        userId: user._id,
        noteId: note._id,
        providerRequested: "auto",
        providerUsed: "openai",
        modelUsed: "gpt-4o-mini",
        fallbackUsed: false,
        fallbackReason: "",
        summary: `${file.title} covers foundational topics that are frequently tested in exams.`,
        keyPoints: ["Definitions", "Comparisons", "Exam-style takeaways"],
        keyConcepts: file.title.includes("Networks")
          ? ["OSI model", "TCP vs UDP", "HTTP and HTTPS"]
          : ["Normalization", "ACID", "Indexes"],
        importantPoints: file.title.includes("Networks")
          ? ["Routers use IP addresses", "Switches forward frames", "TCP is reliable"]
          : ["Primary keys identify records", "Transactions preserve consistency", "Indexes speed reads"],
        examExplanation:
          "Focus on conceptual comparisons, definitions, and the tradeoffs that commonly appear in short-answer and MCQ questions.",
      });
    }

    const existingQuiz = await Quiz.findOne({ userId: user._id, noteId: note._id });

    if (!existingQuiz) {
      await Quiz.create({
        userId: user._id,
        noteId: note._id,
        providerRequested: "auto",
        providerUsed: "openai",
        modelUsed: "gpt-4o-mini",
        fallbackUsed: false,
        fallbackReason: "",
        generatedQuestions: Array.from({ length: 10 }).map((_, index) => ({
          question: `Sample demo question ${index + 1} for ${file.title}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          difficultyLevel: index < 4 ? "Easy" : index < 7 ? "Medium" : "Hard",
          explanation: "This is demo content intended for walkthroughs and presentations.",
        })),
      });
    }

    const existingFlashcards = await Flashcard.findOne({ userId: user._id, noteId: note._id });

    if (!existingFlashcards) {
      await Flashcard.create({
        userId: user._id,
        noteId: note._id,
        providerRequested: "auto",
        providerUsed: "openai",
        modelUsed: "gpt-4o-mini",
        fallbackUsed: false,
        fallbackReason: "",
        cards: [
          {
            question: `What is the main takeaway from ${file.title}?`,
            answer: "Use this seeded deck during demos to show the flashcard flow immediately.",
          },
          {
            question: "How should this project be presented?",
            answer: "Upload notes first, then move to summaries, quizzes, and flashcards for the showcase sequence.",
          },
        ],
      });
    }
  }
};

const seed = async () => {
  await connectToDatabase();

  let user = await User.findOne({ email: env.demoEmail });

  if (!user) {
    user = await User.create({
      name: env.demoName,
      email: env.demoEmail,
      password: env.demoPassword,
    });
  }

  await createDemoArtifacts(user);

  console.log("Demo data ready");
  console.log(`Email: ${env.demoEmail}`);
  console.log("Password: configured via DEMO_PASSWORD");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Failed to seed demo data", error);
  process.exit(1);
});
