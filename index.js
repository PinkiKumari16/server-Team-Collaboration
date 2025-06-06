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

// Allow multiple origins including Vercel preview deployments
const allowedOrigins = [
  "https://client-team-collaboration-evf9.vercel.app/", // main deployed frontend
];

// CORS middleware for HTTP
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // allow requests like Postman
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // allow all vercel previews
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const server = http.createServer(app);

// Socket.IO CORS config
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinRoom", (teamId) => {
    socket.join(teamId);
    console.log(`✅ User joined team room: ${teamId}`);
  });

  socket.on("sendMessage", (data) => {
    const { teamId, ...message } = data;
    io.to(teamId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
