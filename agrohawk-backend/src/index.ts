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
import proyectoRoutes from "./routes/proyecto";
import documentoRoutes from "./routes/documentos";
import resetRoutes from "./routes/reset"
import path from "path";


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
  app.use("/api/proyectos", proyectoRoutes);
  app.use("/api/documentos", documentoRoutes);
  app.use("/api/reset", resetRoutes);

  const frontendPath = path.join(__dirname, "../agrohawk-frontend/dist"); // o 'build' si usas CRA
app.use(express.static(frontendPath));

// Para que todas las rutas no API respondan con index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});