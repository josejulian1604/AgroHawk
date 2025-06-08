import { Router, Request, Response } from "express";
import Documento from "../models/Documento";
import multer from "multer";
import mongoose, { Schema } from "mongoose";

const router = Router();

// Crear un nuevo documento (con base64)
router.post("/", async (req: Request, res: any) => {
  try {
    const { titulo, tipo, archivoURL, subidoPor, relacionadoAProyecto } = req.body;

    // Validación
    if (!titulo || !tipo || !archivoURL || !subidoPor) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
    }

    const nuevoDoc = new Documento({
      titulo,
      tipo,
      archivoURL,
      subidoPor,
      relacionadoAProyecto: relacionadoAProyecto || undefined,
    });

    await nuevoDoc.save();

    res.status(201).json({ mensaje: "Documento guardado exitosamente", documento: nuevoDoc });
  } catch (err) {
    console.error("Error al guardar documento:", err);
    res.status(500).json({ mensaje: "Error al guardar el documento" });
  }
});

// Obtener todos los documentos
router.get("/", async (_req: Request, res: Response) => {
  try {
    const docs = await Documento.find().sort({ fechaSubida: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener documentos" });
  }
});

// Filtrar por tipo
router.get("/tipo/:tipo", async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;
    const docs = await Documento.find({ tipo }).sort({ fechaSubida: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al filtrar por tipo" });
  }
});

// Buscar por nombre o fecha (formato YYYY-MM-DD)
router.get("/buscar", async (req: Request, res: any) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ mensaje: "Falta parámetro de búsqueda" });
    }

    const fecha = new Date(q);
    const query = isNaN(fecha.getTime())
      ? { nombre: { $regex: q, $options: "i" } }
      : {
          fechaSubida: {
            $gte: new Date(fecha.setHours(0, 0, 0, 0)),
            $lte: new Date(fecha.setHours(23, 59, 59, 999)),
          },
        };

    const resultados = await Documento.find(query).sort({ fechaSubida: -1 });
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al buscar documento" });
  }
});

// Eliminar documento
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const eliminado = await Documento.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Documento no encontrado" });
    }
    res.json({ mensaje: "Documento eliminado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar documento" });
  }
});

export default router;