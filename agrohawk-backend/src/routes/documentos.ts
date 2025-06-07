import { Router, Request, Response } from "express";
import Documento from "../models/Documento";

const router = Router();

// Crear nuevo documento
router.post("/", async (req: Request, res: Response) => {
  try {
    const nuevo = new Documento(req.body);
    await nuevo.save();
    res.status(201).json({ mensaje: "Documento creado", documento: nuevo });
  } catch (err) {
    console.error("Error al crear documento:", err);
    res.status(500).json({ mensaje: "Error al crear documento" });
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