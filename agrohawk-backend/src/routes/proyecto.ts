import express, { Request, Response } from "express";
import Proyecto from "../models/Proyecto";
import Usuario from "../models/Usuario";
import Dron from "../models/Drone";

const router = express.Router();

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
