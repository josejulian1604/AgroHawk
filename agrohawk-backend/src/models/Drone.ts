import mongoose, { Schema, Document } from "mongoose";

export interface IDron extends Document {
  modelo: string;
  numeroSerie: string;
  placa: string;
  proyectoAsignado: mongoose.Types.ObjectId;
  estado: "disponible" | "ocupado" | "mantenimiento";
  observaciones?: string;
  creadoEn?: Date;
}

const DronSchema: Schema = new Schema({
  modelo: { type: String, required: true },
  numeroSerie: { type: String, required: true, unique: true },
  placa: { type: String, required: true, unique: true },
  proyectoAsignado: {
  type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", default: null,},
  estado: {
  type: String,
  enum: ["disponible", "ocupado", "mantenimiento"],
  lowercase: true,
  required: true,
  },
  observaciones: { type: String, default: "" },
  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model<IDron>("Dron", DronSchema);
