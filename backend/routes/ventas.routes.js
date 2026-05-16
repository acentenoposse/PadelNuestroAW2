import { Router } from 'express';
import { leerJson, guardarJson, obtenerSiguienteId } from '../utils/db.js';

const router = Router();

// GET /ventas
router.get('/', async (req, res) => {
  try {
    const { ventas } = await leerJson('ventas.json');
    res.json({ ventas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas', error: error.message });
  }
});

// POST /ventas
router.post('/', async (req, res) => {
  try {
    const { usuarioId, items } = req.body;

    if (!usuarioId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar usuarioId e items de la venta' });
    }

    const dataUsuarios = await leerJson('usuarios.json');
    const dataProductos = await leerJson('productos.json');
    const dataVentas = await leerJson('ventas.json');

    const usuarioExiste = dataUsuarios.usuarios.some((usuario) => usuario.id === Number(usuarioId));

    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: 'El usuario indicado no existe' });
    }

    const itemsNormalizados = [];

    for (const item of items) {
      const producto = dataProductos.productos.find(
        (productoActual) => productoActual.id === Number(item.productoId)
      );

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

    const nuevaVenta = {
      id: obtenerSiguienteId(dataVentas.ventas),
      usuarioId: Number(usuarioId),
      fecha: new Date().toISOString().slice(0, 10),
      total,
      items: itemsNormalizados
    };

    dataVentas.ventas.push(nuevaVenta);
    await guardarJson('ventas.json', dataVentas);

    res.status(201).json({ mensaje: 'Venta creada correctamente', venta: nuevaVenta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear venta', error: error.message });
  }
});

export default router;
