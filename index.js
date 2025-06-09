import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://client-team-collaboration.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (teamId) => {
    socket.join(teamId);
    console.log(`User joined team room: ${teamId}`);
  });

  socket.on("sendMessage", (data) => {
    const { teamId, ...message } = data;
    io.to(teamId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(
    `✅ Server running on http://localhost:${process.env.PORT || 5000}`
  );
});
