import mongoose, { Schema, Document } from "mongoose";

export interface IDocumento extends Document {
  titulo: string;
  tipo: "minuta" | "estado financiero" | "presentación" | "reporte operativo";
  archivoURL: string; 
  fechaSubida: Date;
  subidoPor: mongoose.Types.ObjectId;
  relacionadoAProyecto?: mongoose.Types.ObjectId;
}

const DocumentoSchema: Schema = new Schema({
  titulo: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["minuta", "estado financiero", "presentación", "reporte operativo"],
    required: true,
  },
  archivoURL: { type: String, required: true },
  fechaSubida: { type: Date, default: Date.now },
  subidoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  relacionadoAProyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" },
});

export default mongoose.model<IDocumento>("Documento", DocumentoSchema);
