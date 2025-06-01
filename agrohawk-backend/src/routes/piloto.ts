import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const pilotos = await Usuario.find({ rol: "piloto" });
    res.status(200).json(pilotos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pilotos." });
  }
});

export default router;