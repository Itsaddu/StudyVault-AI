import app from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectToDatabase();

    const server = app.listen(env.port, "0.0.0.0", () => {
      console.log(`Backend server running on port ${env.port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Failed to start server: port ${env.port} is already in use.`);
      } else {
        console.error("Failed to start server", error);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
