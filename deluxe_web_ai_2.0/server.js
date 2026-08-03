import dotenv from "dotenv";

const result = dotenv.config();

import express from "express";
import cors from "cors";

import TelegramService from "./src/modules/telegram/TelegramService.js";

const telegram = new TelegramService();

import vectorStore from "./src/ai/rag/VectorStore.js";
import dbConnect from "./src/config/database.js";
import chatRoutes from "./src/api/routes/chat.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await dbConnect();

    await vectorStore.load(process.env.VECTOR_STORE_PATH);
    console.log("VectorStore loaded successfully.");

    // console.log("Server loaded:", vectorStore.isLoaded());
    // console.log("VectorStore object:", vectorStore);

    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed:", error);
  }
}

startServer();
