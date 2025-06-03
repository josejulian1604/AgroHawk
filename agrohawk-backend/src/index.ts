import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import cors from "cors";
import adminsRouter from "./routes/admin";
import gerentesRouter from "./routes/gerente";
import sociosRouter from "./routes/socio";
import pilotoRouter from "./routes/piloto";
import dronRoutes from "./routes/dron";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor AgroHawk Backend funcionando ✅");
});

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("🟢 Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
  });

  app.use(cors()); 
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admins", adminsRouter);
  app.use("/api/gerentes", gerentesRouter);
  app.use("/api/socios", sociosRouter);
  app.use("/api/pilotos", pilotoRouter);
  app.use("/api/drones", dronRoutes);