import mongoose, { Schema, Document } from "mongoose";

// 1. Definir la interfaz TypeScript para un usuario
export interface IUsuario extends Document {
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  contraseña: string;
  rol: string;
  cedula: string;
  telefono: string;
  creadoEn?: Date;
}

// 2. Definir el esquema de Mongoose
const UsuarioSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido1: {
    type: String,
    required: true,
  },
  apellido2: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "piloto", "socio", "gerente"],
    default: "socio",
  },
  cedula: {
    type: String,
    required: true,
    default: "", 
  },
  telefono: {
    type: String,
    default: "", 
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

// 3. Exportar el modelo
export default mongoose.model<IUsuario>("Usuario", UsuarioSchema);
