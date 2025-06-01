import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const gerentes = await Usuario.find({ rol: "gerente" });
    res.status(200).json(gerentes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener gerentes operativos." });
  }
});

export default router;