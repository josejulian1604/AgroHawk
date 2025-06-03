import express, { Request, Response } from "express";
import Proyecto from "../models/Proyecto";
import Usuario from "../models/Usuario";
import Dron from "../models/Drone";

const router = express.Router();

// Crear un nuevo proyecto
router.post("/", async (req: Request, res: any) => {
  try {
    const {
      nombre,
      cliente,
      ubicacion,
      fecha,
      piloto,
      dron,
      creadoPor
    } = req.body;

    // Validaciones
    if (!nombre || !cliente || !ubicacion || !fecha || !piloto || !dron || !creadoPor) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
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
      fecha,
      piloto,
      dron,
      creadoPor
    });

    await nuevoProyecto.save();
    res.status(201).json({ mensaje: "Proyecto creado con éxito", proyecto: nuevoProyecto });

  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener Todos.
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

// Actualizar.
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

// Eliminar
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