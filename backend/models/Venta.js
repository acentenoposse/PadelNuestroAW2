import mongoose from 'mongoose';

// Cada item guarda el precio al momento de la venta (snapshot histórico).
const itemSchema = new mongoose.Schema(
  {
    productoId: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true }
  },
  { _id: false }
);

const ventaSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    usuarioId: { type: Number, required: true },
    fecha: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: [itemSchema], default: [] }
  },
  { versionKey: false }
);

export const Venta = mongoose.model('Venta', ventaSchema);
