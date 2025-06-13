import express, { Request, Response } from "express";
import Proyecto from "../models/Proyecto";
import Usuario from "../models/Usuario";
import Dron from "../models/Drone";
import multer from "multer";
import cloudinary from "./cloudinaryConfig"; 
import { Stream } from "stream";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Definir la interfaz correctamente extendiendo Request
interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

// Crear un nuevo proyecto
router.post("/", async (req: Request, res: any) => {
  try {
    const { nombre, cliente, ubicacion, fecha, piloto, dron, creadoPor } = req.body;

    if (!nombre || !cliente || !ubicacion || !fecha || !piloto || !dron || !creadoPor) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
    }

    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) {
      return res.status(400).json({ mensaje: "La fecha no es válida." });
    }

    const pilotoExiste = await Usuario.findById(piloto);
    const dronExiste = await Dron.findById(dron);
    const gerenteExiste = await Usuario.findById(creadoPor);

    if (!pilotoExiste || !dronExiste || !gerenteExiste) {
      return res.status(400).json({ mensaje: "Piloto, dron o creador no válido." });
    }

    const nuevoProyecto = new Proyecto({
      nombre,
      cliente,
      ubicacion,
      fecha: fechaValida,
      piloto,
      dron,
      creadoPor,
    });

    await nuevoProyecto.save();

    await Dron.findByIdAndUpdate(dron, {
      proyectoAsignado: nuevoProyecto._id,
      estado: "ocupado",
    });

    res.status(201).json({ mensaje: "Proyecto creado con éxito", proyecto: nuevoProyecto });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener proyectos por ID del piloto
router.get("/piloto/:pilotoId", async (req: Request, res: any) => {
  try {
    const { pilotoId } = req.params;

    const pilotoExiste = await Usuario.findById(pilotoId);
    if (!pilotoExiste) {
      return res.status(404).json({ mensaje: "Piloto no encontrado." });
    }

    const proyectos = await Proyecto.find({ piloto: pilotoId })
      .populate("piloto", "nombre apellido1")
      .populate("dron", "modelo placa")
      .populate("creadoPor", "nombre apellido1");

    if (proyectos.length === 0) {
      return res.status(200).json({
        mensaje: "No se encontraron proyectos para este piloto",
        proyectos: [],
      });
    }


    res.status(200).json({
      mensaje: `Se encontraron ${proyectos.length} proyecto(s) para el piloto`,
      proyectos,
    });
  } catch (error) {
    console.error("Error al obtener proyectos por piloto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

// Subir imágenes de boletas al proyecto - versión cloudinary
router.post("/:id/subir-boletas", upload.array("imagenes", 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      res.status(404).json({ mensaje: "Proyecto no encontrado." });
      return;
    }

    const files = (req as MulterRequest).files;
    if (!files || files.length === 0) {
      res.status(400).json({ mensaje: "No se subieron imágenes." });
      return;
    }

    const subirACloudinary = (file: Express.Multer.File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(file.buffer);

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "boletas",
            resource_type: "image",
            type: "upload",
            access_mode: "public",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );

        bufferStream.pipe(stream);
      });
    };

    const nuevasImagenes: string[] = [];

    for (const file of files) {
      const url = await subirACloudinary(file);
      nuevasImagenes.push(url);
    }

    proyecto.imagenesBoletas.push(...nuevasImagenes);
    await proyecto.save();

    res.status(200).json({
      mensaje: "Imágenes subidas correctamente.",
      imagenesBoletas: proyecto.imagenesBoletas,
    });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ mensaje: "Error interno al subir imágenes." });
  }
});

// Subir pdf a proyecto - cloudify
router.put("/:id/reporte", upload.single("reportePDF"), async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    const file = (req as MulterRequest).file;
    if (!file) {
      return res.status(400).json({ mensaje: "No se subió ningún archivo." });
    }

    // Subir a Cloudinary
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);

    const urlPDF: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "reportes_pdf",
          resource_type: "raw",
          type: "upload",
          access_mode: "public",
          public_id: `reporte_${proyecto.nombre?.replace(/\s+/g, "_")}_${Date.now()}.pdf`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );
      bufferStream.pipe(stream);
    });

    // Guardar la URL en el proyecto
    proyecto.reportePDF = urlPDF;
    await proyecto.save();

    res.status(200).json({
      mensaje: "PDF subido correctamente.",
      reportePDF: urlPDF,
    });
  } catch (error) {
    console.error("Error al subir PDF:", error);
    res.status(500).json({ mensaje: "Error al subir PDF", error });
  }
});

// Subir imagen de recorrido al proyecto - cloudinary
router.post("/:id/subir-recorrido", upload.single("imagen"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      res.status(404).json({ mensaje: "Proyecto no encontrado." });
      return;
    }

    const file = (req as MulterRequest).file;
    if (!file) {
      res.status(400).json({ mensaje: "No se subió ninguna imagen." });
      return;
    }

    // Subir a Cloudinary
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);

    const urlImagen: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "recorridos",
          resource_type: "image",
          type: "upload",
          access_mode: "public",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );
      bufferStream.pipe(stream);
    });

    // Guardar la URL en el proyecto
    proyecto.imagenRecorrido = urlImagen;
    await proyecto.save();

    res.status(200).json({
      mensaje: "Imagen de recorrido subida correctamente.",
      imagenRecorrido: urlImagen,
    });
  } catch (error) {
    console.error("Error al subir imagen de recorrido:", error);
    res.status(500).json({ mensaje: "Error interno al subir imagen de recorrido." });
  }
});

// Agregar un comentario
router.post("/:id/comentario", async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto || typeof texto !== "string") {
      return res.status(400).json({ mensaje: "Comentario inválido" });
    }

    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    proyecto.comentarios = proyecto.comentarios || [];
    proyecto.comentarios.push(texto);
    await proyecto.save();

    res.status(200).json({ mensaje: "Comentario agregado", comentarios: proyecto.comentarios });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

// Obtener todos los proyectos
router.get("/", async (_req: Request, res: Response) => {
  try {
    const proyectos = await Proyecto.find()
      .populate("piloto", "nombre apellido1")
      .populate("dron", "modelo placa")
      .populate("creadoPor", "nombre apellido1");

    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proyectos", error });
  }
});

// Obtener reportes operativos desde proyectos
router.get("/reportes-operativos", async (_req: Request, res: Response) => {
  try {
    const proyectos = await Proyecto.find({
      $or: [
        { imagenesBoletas: { $exists: true, $type: "array", $not: { $size: 0 } } },
        { imagenRecorrido: { $exists: true, $type: "string", $ne: "" } },
        { reportePDF: { $exists: true, $type: "string", $ne: "" } }
      ]
    })
      .sort({ creadoEn: -1 })
      .select("nombre fecha imagenesBoletas imagenRecorrido reportePDF creadoEn");

    res.json(proyectos);
  } catch (err) {
    console.error("Error al obtener reportes operativos:", err);
    res.status(500).json({ mensaje: "Error al obtener reportes operativos" });
  }
});

// Esta debe ir al FINAL para evitar conflictos
router.get("/:id", async (req: Request, res: any) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
      .populate("piloto", "nombre apellido1")
      .populate("dron", "modelo placa")
      .populate("creadoPor", "nombre apellido1");

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

// Actualizar proyecto
router.put("/:id", async (req: Request, res: any) => {
  try {
    const actualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }
    if (
      actualizado.status?.toLowerCase() === "completado" &&
      actualizado.dron
    ) {
      await Dron.findByIdAndUpdate(actualizado.dron, {
        proyectoAsignado: null,
        estado: "disponible",
      });
    }

    res.status(200).json({ mensaje: "Proyecto actualizado", proyecto: actualizado });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

// Eliminar proyecto
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    // Eliminar imágenes de boletas
    for (const url of proyecto.imagenesBoletas || []) {
      const partes = url.split("/");
      const folder = partes.at(-2);
      const filename = partes.at(-1); // Incluye la extensión
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    // Eliminar imagen de recorrido
    if (proyecto.imagenRecorrido) {
      const partes = proyecto.imagenRecorrido.split("/");
      const folder = partes.at(-2);
      const filename = partes.at(-1);
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    // Eliminar PDF
    if (proyecto.reportePDF) {
      const partes = proyecto.reportePDF.split("/");
      const folder = partes.at(-2);
      const filename = partes.at(-1);
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    // Desasociar el dron asignado al proyecto
    if (proyecto.dron) {
      await Dron.findByIdAndUpdate(proyecto.dron, {
        proyectoAsignado: null,
        estado: "disponible",
      });
    }

    // Eliminar el proyecto de Mongo
    await proyecto.deleteOne();

    res.status(200).json({ mensaje: "Proyecto y archivos eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
});

export default router;