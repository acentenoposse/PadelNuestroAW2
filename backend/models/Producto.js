import mongoose from 'mongoose';

// categorias es un array de ids numéricos de categoría (ej. [1, 5, 6]).
const productoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    img: { type: String, required: true },
    categorias: { type: [Number], default: [] },
    stockActivo: { type: Boolean, default: true }
  },
  { versionKey: false }
);

export const Producto = mongoose.model('Producto', productoSchema);
