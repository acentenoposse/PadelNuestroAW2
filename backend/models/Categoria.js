import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
  },
  { versionKey: false }
);

export const Categoria = mongoose.model('Categoria', categoriaSchema);
