import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req: Request, res: any) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET || "supersecreto",
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

export default router;
