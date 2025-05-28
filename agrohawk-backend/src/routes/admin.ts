import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const admins = await Usuario.find({ rol: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener administradores" });
  }
});

export default router;