import mongoose, { Schema, Document } from "mongoose";

export interface IProyecto extends Document {
  nombre: string;
  cliente: string;
  ubicacion: string;
  fecha: Date;
  status: "pendiente" | "en revisión" | "completado";

  piloto: mongoose.Types.ObjectId;
  dron: mongoose.Types.ObjectId;
  creadoPor: mongoose.Types.ObjectId;

  cultivo?: string;
  producto?: string;
  boquillas?: string;
  anchoAplicado?: number;
  alturaAplicada?: number;
  volumenAplicado?: number;
  hectareas?: number;

  imagenesBoletas: string[];
  imagenRecorrido?: string;
  reportePDF?: string;

  comentarios: string[];
  estadoActual?: string;

  creadoEn?: Date;
}

const ProyectoSchema = new Schema<IProyecto>({
  nombre: { type: String, required: true },
  cliente: { type: String, required: true },
  ubicacion: { type: String, required: true },
  fecha: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pendiente", "en revisión", "completado"],
    default: "pendiente",
  },

  piloto: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  dron: { type: mongoose.Schema.Types.ObjectId, ref: "Dron", required: true },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },

  cultivo: String,
  producto: String,
  boquillas: String,
  anchoAplicado: Number,
  alturaAplicada: Number,
  volumenAplicado: Number,
  hectareas: Number,

  imagenesBoletas: { type: [String], default: [] },
  imagenRecorrido: { type: String, default: "" },
  reportePDF: { type: String, default: "" },

  comentarios: { type: [String], default: [] },
  estadoActual: { type: String, default: "Pendiente" },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model<IProyecto>("Proyecto", ProyectoSchema);
