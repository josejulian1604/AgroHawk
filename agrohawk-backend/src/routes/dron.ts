import { Router, Request, Response } from "express";
import Dron from "../models/Drone";

const router = Router();

const estadosValidos = ["disponible", "ocupado", "mantenimiento"];

// Crear un nuevo dron con validaciones
router.post("/", async (req: Request, res: any) => {
  try {
    const {
      modelo,
      numeroSerie,
      placa,
      estado,
      proyectoAsignado,
      observaciones,
    } = req.body;

    // Validar campos obligatorios
    if (!modelo || !numeroSerie || !placa || !estado) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
    }

    // Validar estado permitido
    if (!estadosValidos.includes(estado.toLowerCase())) {
      return res.status(400).json({ mensaje: "Estado no válido." });
    }

    // Verificar placa única
    if (typeof placa !== "string" || placa.trim().startsWith("$")) {
      return res.status(400).json({ mensaje: "Placa inválida." });
    }
    if (typeof numeroSerie !== "string" || numeroSerie.trim().startsWith("$")) {
      return res.status(400).json({ mensaje: "Número de serie inválido." });
    }

    // Verificar placa única
    const placaExistente = await Dron.findOne({ placa });
    if (placaExistente) {
      return res.status(400).json({ mensaje: "La placa ya está registrada." });
    }

    // Verificar número de serie único
    const serieExistente = await Dron.findOne({ numeroSerie });
    if (serieExistente) {
      return res
        .status(400)
        .json({ mensaje: "El número de serie ya está registrado." });
    }

    const nuevoDron = new Dron({
      modelo,
      numeroSerie,
      placa,
      estado: estado.toLowerCase(),
      proyectoAsignado: proyectoAsignado || null,
      observaciones: observaciones || "",
    });

    await nuevoDron.save();
    res
      .status(201)
      .json({ mensaje: "Dron registrado correctamente", dron: nuevoDron });
  } catch (error) {
    console.error("Error al crear dron:", error);
    res.status(500).json({ mensaje: "Error al registrar el dron", error });
  }
});

// Obtener todos los drones
router.get("/", async (_req: Request, res: Response) => {
  try {
    const drones = await Dron.find();
    res.status(200).json(drones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener drones", error });
  }
});

// Obtener un dron por ID
router.get("/:id", async (req: Request, res: any) => {
  try {
    const dron = await Dron.findById(req.params.id);
    if (!dron) return res.status(404).json({ mensaje: "Dron no encontrado" });
    res.status(200).json(dron);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el dron", error });
  }
});

// Actualizar un dron con validaciones
router.put("/:id", async (req: Request, res: any) => {
  try {
    const {
      modelo,
      numeroSerie,
      placa,
      estado,
      proyectoAsignado,
      observaciones,
    } = req.body;
    const { id } = req.params;

    // Validar estado si se envía
    if (estado && !estadosValidos.includes(estado.toLowerCase())) {
      return res.status(400).json({ mensaje: "Estado no válido." });
    }

    // Verificar si otra unidad ya tiene esta placa
    if (placa) {
      if (typeof placa !== "string" || placa.trim().startsWith("$")) {
        return res.status(400).json({ mensaje: "Placa inválida." });
      }

      if (typeof id !== "string" || id.trim().startsWith("$")) {
        return res.status(400).json({ mensaje: "ID inválido." });
      }

      const conflictoPlaca = await Dron.findOne({ placa, _id: { $ne: id } });
      if (conflictoPlaca) {
        return res
          .status(400)
          .json({ mensaje: "Otra unidad ya tiene esta placa." });
      }
    }

    // Verificar si otra unidad ya tiene este número de serie
    if (numeroSerie) {
      if (
        typeof numeroSerie !== "string" ||
        numeroSerie.trim().startsWith("$")
      ) {
        return res.status(400).json({ mensaje: "Número de serie inválido." });
      }

      if (typeof id !== "string" || id.trim().startsWith("$")) {
        return res.status(400).json({ mensaje: "ID inválido." });
      }

      const conflictoSerie = await Dron.findOne({
        numeroSerie,
        _id: { $ne: id },
      });

      if (conflictoSerie) {
        return res
          .status(400)
          .json({ mensaje: "Otra unidad ya tiene este número de serie." });
      }
    }

    const actualizado = await Dron.findByIdAndUpdate(
      id,
      {
        modelo,
        numeroSerie,
        placa,
        estado: estado?.toLowerCase(),
        proyectoAsignado: proyectoAsignado || null,
        observaciones: observaciones || "",
      },
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Dron no encontrado" });
    }

    res
      .status(200)
      .json({ mensaje: "Dron actualizado correctamente", dron: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el dron", error });
  }
});

// Eliminar un dron
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const eliminado = await Dron.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ mensaje: "Dron no encontrado" });
    res.status(200).json({ mensaje: "Dron eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el dron", error });
  }
});

export default router;
