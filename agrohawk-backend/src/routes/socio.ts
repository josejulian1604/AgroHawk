import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const socios = await Usuario.find({ rol: "socio" });
    res.status(200).json(socios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener socios." });
  }
});

export default router;