import express, { Request, Response } from "express";
import Proyecto from "../models/Proyecto";
import Usuario from "../models/Usuario";
import Dron from "../models/Drone";
import multer from "multer";

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

// Subir imágenes de boletas al proyecto - VERSIÓN CORREGIDA
router.post("/:id/subir-boletas", upload.array("imagenes", 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      res.status(404).json({ mensaje: "Proyecto no encontrado." });
      return;
    }

    // Casting seguro del request para acceder a files
    const files = (req as MulterRequest).files;
    
    if (!files || files.length === 0) {
      res.status(400).json({ mensaje: "No se subieron imágenes." });
      return;
    }

    const nuevasImagenes = files.map((file) =>
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );

    proyecto.imagenesBoletas.push(...nuevasImagenes);
    await proyecto.save();

    res.status(200).json({ mensaje: "Imágenes subidas correctamente.", imagenesBoletas: proyecto.imagenesBoletas });
  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ mensaje: "Error interno al subir imágenes." });
  }
});

// Subir pdf a proyecto
router.put('/:id/reporte', async (req, res) => {
  const { reportePDF } = req.body;
  const proyecto = await Proyecto.findByIdAndUpdate(
    req.params.id,
    { reportePDF },
    { new: true }
  );
  res.json({ mensaje: "Reporte guardado", proyecto });
});

// Subir imagen de recorrido al proyecto
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

    const imagenBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    proyecto.imagenRecorrido = imagenBase64;
    await proyecto.save();

    res.status(200).json({ mensaje: "Imagen de recorrido subida correctamente.", imagenRecorrido: imagenBase64 });
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
        { imagenesBoletas: { $exists: true, $not: { $size: 0 } } },
        { imagenRecorrido: { $exists: true, $ne: "" } },
        { reportePDF: { $exists: true, $ne: "" } }
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

    res.status(200).json({ mensaje: "Proyecto actualizado", proyecto: actualizado });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

// Eliminar proyecto
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const eliminado = await Proyecto.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    res.status(200).json({ mensaje: "Proyecto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
});

export default router;