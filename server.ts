import dotenv from "dotenv";
import "express-async-errors";
import express, { Application, Request, Response } from "express";
import path from "path";
import { logger, logEvents } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

import cookieParser from "cookie-parser";
import cors from "cors";

import { corsOptions } from "./config/corsOptions";

import mongoose from "mongoose";
import { connectDB } from "./config/dbConnect";

// Routes
import root from "./routes/root";
import userRoutes from "./routes/userRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import workflowRoutes from "./routes/workflowRoutes";

const app: Application = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", root);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/projects", projectRoutes);
app.use("/comments", commentRoutes);
app.use("/workflows", workflowRoutes);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err: any) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
