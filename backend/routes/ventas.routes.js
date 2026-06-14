import { Router } from 'express';
import { Venta } from '../models/Venta.js';
import { Usuario } from '../models/Usuario.js';
import { Producto } from '../models/Producto.js';
import { obtenerSiguienteId } from '../utils/secuencia.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// GET /ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find().select('-_id').lean();
    res.json({ ventas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas', error: error.message });
  }
});

// POST /ventas  (requiere token: comprar es una acción clave)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { usuarioId, items } = req.body;

    if (!usuarioId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar usuarioId e items de la venta' });
    }

    const usuarioExiste = await Usuario.exists({ id: Number(usuarioId) });

    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: 'El usuario indicado no existe' });
    }

    const itemsNormalizados = [];

    for (const item of items) {
      const producto = await Producto.findOne({ id: Number(item.productoId) }).lean();

      if (!producto) {
        return res.status(404).json({ mensaje: `El producto ${item.productoId} no existe` });
      }

      if (!producto.stockActivo) {
        return res.status(409).json({
          mensaje: `El producto ${producto.nombre} no posee stock activo y no puede venderse`
        });
      }

      const cantidad = Number(item.cantidad);

      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ mensaje: 'La cantidad de cada item debe ser mayor a 0' });
      }

      itemsNormalizados.push({
        productoId: producto.id,
        cantidad,
        precio: producto.precio
      });
    }

    const total = itemsNormalizados.reduce(
      (acumulador, item) => acumulador + item.precio * item.cantidad,
      0
    );

    const nuevaVenta = await Venta.create({
      id: await obtenerSiguienteId(Venta),
      usuarioId: Number(usuarioId),
      fecha: new Date().toISOString().slice(0, 10),
      total,
      items: itemsNormalizados
    });

    const venta = await Venta.findOne({ id: nuevaVenta.id }).select('-_id').lean();

    res.status(201).json({ mensaje: 'Venta creada correctamente', venta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear venta', error: error.message });
  }
});

export default router;
