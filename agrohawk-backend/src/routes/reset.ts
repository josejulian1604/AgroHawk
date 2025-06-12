import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario, { IUsuario } from "../models/Usuario";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// 📤 Paso 1: Enviar enlace con token al correo
router.post("/reset-password", async (req: Request, res: any) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Correo no registrado" });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || "supersecreto",
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

// 🔐 Paso 2: Recibir nueva contraseña y actualizarla
router.post("/change-password", async (req: Request, res: any) => {
  const { token, nuevaPassword } = req.body;

  if (!token || !nuevaPassword) {
    return res.status(400).json({ mensaje: "Token y nueva contraseña requeridos" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const usuario = await Usuario.findById(decoded.id) as IUsuario;

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);
    usuario.contraseña = hashedPassword;

    await usuario.save();
    return res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
});

export default router;
