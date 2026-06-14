import mongoose from 'mongoose';

// Mantenemos un id numérico propio (además del _id de Mongo) para no
// romper el frontend, que referencia a los usuarios por id numérico.
const usuarioSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'cliente' }
  },
  { versionKey: false }
);

export const Usuario = mongoose.model('Usuario', usuarioSchema);
