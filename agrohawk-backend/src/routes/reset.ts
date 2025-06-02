import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/reset-password", async (req: any, res: any) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Correo no registrado" });
    }

    // Crear un token JWT de un solo uso con expiración de 15 minutos
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || "supersecreto",
      { expiresIn: "15m" }
    );

    // Construir URL de restablecimiento
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Enviar el correo
    await transporter.sendMail({
      from: `"AgroHawk" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña - AgroHawk",
      html: `
        <p>Hola ${usuario.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    return res.status(200).json({ mensaje: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
});

export default router;
