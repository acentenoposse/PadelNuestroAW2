import { Router } from 'express';
import { Producto } from '../models/Producto.js';
import { Venta } from '../models/Venta.js';
import { obtenerSiguienteId } from '../utils/secuencia.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// GET /productos
router.get('/', async (req, res) => {
  try {
    const { categoriaId, stockActivo } = req.query;
    const filtro = {};

    if (categoriaId) {
      filtro.categorias = Number(categoriaId);
    }

    if (stockActivo !== undefined) {
      filtro.stockActivo = stockActivo === 'true';
    }

    const productos = await Producto.find(filtro).select('-_id').lean();

    res.json({ productos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// GET /productos/:id
router.get('/:id', async (req, res) => {
  try {
    const productoId = Number(req.params.id);
    const producto = await Producto.findOne({ id: productoId }).select('-_id').lean();

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
});

// POST /productos  (requiere token)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, img, categorias, stockActivo = true } = req.body;

    if (!nombre || !descripcion || !precio || !img || !Array.isArray(categorias)) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios: nombre, descripcion, precio, img y categorias'
      });
    }

    if (typeof stockActivo !== 'boolean') {
      return res.status(400).json({ mensaje: 'stockActivo debe ser boolean: true o false' });
    }

    const nuevoProducto = await Producto.create({
      id: await obtenerSiguienteId(Producto),
      nombre,
      descripcion,
      precio: Number(precio),
      img,
      categorias,
      stockActivo
    });

    const producto = await Producto.findOne({ id: nuevoProducto.id }).select('-_id').lean();

    res.status(201).json({ mensaje: 'Producto creado correctamente', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// PUT /productos/:id  (requiere token)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const productoId = Number(req.params.id);

    if (req.body.stockActivo !== undefined && typeof req.body.stockActivo !== 'boolean') {
      return res.status(400).json({ mensaje: 'stockActivo debe ser boolean: true o false' });
    }

    // No permitimos sobreescribir el id desde el body.
    const { id: _ignorarId, ...cambios } = req.body;
    if (cambios.precio !== undefined) {
      cambios.precio = Number(cambios.precio);
    }

    const producto = await Producto.findOneAndUpdate(
      { id: productoId },
      { $set: cambios },
      { new: true }
    ).select('-_id').lean();

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// DELETE /productos/:id  (requiere token)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const productoId = Number(req.params.id);

    const productoExiste = await Producto.exists({ id: productoId });

    if (!productoExiste) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const productoRelacionadoConVenta = await Venta.exists({ 'items.productoId': productoId });

    if (productoRelacionadoConVenta) {
      return res.status(409).json({
        mensaje:
          'No se puede eliminar el producto porque está relacionado con una venta existente. Primero elimine/modifique la venta correspondiente.'
      });
    }

    await Producto.deleteOne({ id: productoId });

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

export default router;
