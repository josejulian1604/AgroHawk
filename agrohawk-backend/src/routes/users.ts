import { Router, Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { nombre, apellido1, apellido2, correo, contraseña, rol, cedula, telefono } = req.body;

  try {
    // Verificar si ya existe un usuario con ese correo
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido1,
        apellido2,
        correo,
        contraseña: hashedPassword,
        rol,
        cedula,
        telefono,
      });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener todos los usuarios
router.get("/", async (req: Request, res: Response) => {
    try {
      const usuarios = await Usuario.find().select("-contraseña");
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener usuarios", error });
    }
});

// Obtener un usuario por ID
router.get("/:id", async (req: Request, res: any) => {
    try {
      const usuario = await Usuario.findById(req.params.id).select("-contraseña");
  
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener el usuario", error });
    }
});

// Actualizar un usuario por ID (incluyendo hash de contraseña si cambia)
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
      const { nombre, apellido1, apellido2, correo, contraseña, rol, cedula, telefono } = req.body;
  
      // Preparar objeto con los campos a actualizar
      const actualizaciones: any = { nombre, apellido1, apellido2, correo, rol, cedula, telefono };
  
      // Si se incluye una nueva contraseña, la hasheamos
      if (contraseña) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
        actualizaciones.contraseña = hashedPassword;
      }
  
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        actualizaciones,
        { new: true, runValidators: true }
      );
  
      if (!usuarioActualizado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      res.status(200).json({
        mensaje: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
    }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
      const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
  
      if (!usuarioEliminado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
    }
});
  

export default router;