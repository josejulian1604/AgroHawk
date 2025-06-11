import { Router, Request, Response } from "express";
import Documento from "../models/Documento";
import multer from "multer";
import { Stream } from "stream";
import cloudinary from "./cloudinaryConfig"; 
import { v2 as cloud } from "cloudinary";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear un nuevo documento 
router.post("/", upload.single("archivo"), async (req: Request, res: any) => {
  try {
    const { titulo, tipo, subidoPor, relacionadoAProyecto } = req.body;
    const file = req.file;

    if (!titulo || !tipo || !subidoPor || !file) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios o archivo." });
    }

    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);

    const extension = file.originalname.split(".").pop();
    const nombreLimpio = titulo.replace(/\s+/g, "_");
    const publicId = `${nombreLimpio}_${Date.now()}.${extension}`;

    const archivoURL: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "documentos",
          resource_type: "raw",
          type: "upload",
          access_mode: "public",
          public_id: publicId
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );
      bufferStream.pipe(stream);
    });

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

// Eliminar documento y su archivo en Cloudinary
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const documento = await Documento.findById(req.params.id);
    if (!documento) {
      return res.status(404).json({ mensaje: "Documento no encontrado" });
    }

    if (documento.archivoURL) {
      const partes = documento.archivoURL.split("/");
      const filename = partes.at(-1); // archivo.pdf
      const folder = partes.at(-2);   // carpeta (ej. "documentos")
      const publicId = `${folder}/${filename}`;
      console.log("🔑 Public ID exacto:", publicId);

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw"
      });

      console.log("🧹 Resultado eliminación:", result);
    }

    await documento.deleteOne();
    res.json({ mensaje: "Documento eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ mensaje: "Error al eliminar documento" });
  }
});

export default router;