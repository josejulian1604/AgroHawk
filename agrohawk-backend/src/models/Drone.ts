import mongoose, { Schema, Document } from "mongoose";

export interface IDron extends Document {
  modelo: string;
  numeroSerie: string;
  placa: string;
  proyectoAsignado: string;
  estado: "Disponible" | "Ocupado" | "Mantenimiento";
  observaciones?: string;
  creadoEn?: Date;
}

const DronSchema: Schema = new Schema({
  modelo: { type: String, required: true },
  numeroSerie: { type: String, required: true, unique: true },
  placa: { type: String, required: true, unique: true },
  proyectoAsignado: { type: String, default: "N/A" },
  estado: {
    type: String,
    enum: ["Disponible", "Ocupado", "Mantenimiento"],
    default: "Disponible",
  },
  observaciones: { type: String, default: "" },
  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model<IDron>("Dron", DronSchema);
