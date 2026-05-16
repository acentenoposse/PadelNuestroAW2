import { Router } from 'express';
import { leerJson, guardarJson, obtenerSiguienteId } from '../utils/db.js';

const router = Router();

// GET /productos
router.get('/', async (req, res) => {
  try {
    const { productos } = await leerJson('productos.json');
    const { categoriaId, stockActivo } = req.query;

    let productosFiltrados = productos;

    if (categoriaId) {
      const categoriaNumerica = Number(categoriaId);
      productosFiltrados = productosFiltrados.filter((producto) =>
        producto.categorias.includes(categoriaNumerica)
      );
    }

    if (stockActivo !== undefined) {
      const valorBooleano = stockActivo === 'true';
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.stockActivo === valorBooleano
      );
    }

    res.json({ productos: productosFiltrados });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// GET /productos/:id
router.get('/:id', async (req, res) => {
  try {
    const { productos } = await leerJson('productos.json');
    const productoId = Number(req.params.id);
    const producto = productos.find((item) => item.id === productoId);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
});

// POST /productos
router.post('/', async (req, res) => {
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

    const dataProductos = await leerJson('productos.json');

    const nuevoProducto = {
      id: obtenerSiguienteId(dataProductos.productos),
      nombre,
      descripcion,
      precio: Number(precio),
      img,
      categorias,
      stockActivo
    };

    dataProductos.productos.push(nuevoProducto);
    await guardarJson('productos.json', dataProductos);

    res.status(201).json({ mensaje: 'Producto creado correctamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// PUT /productos/:id
router.put('/:id', async (req, res) => {
  try {
    const productoId = Number(req.params.id);
    const dataProductos = await leerJson('productos.json');
    const indiceProducto = dataProductos.productos.findIndex((producto) => producto.id === productoId);

    if (indiceProducto === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (req.body.stockActivo !== undefined && typeof req.body.stockActivo !== 'boolean') {
      return res.status(400).json({ mensaje: 'stockActivo debe ser boolean: true o false' });
    }

    const productoActualizado = {
      ...dataProductos.productos[indiceProducto],
      ...req.body,
      id: productoId
    };

    if (productoActualizado.precio !== undefined) {
      productoActualizado.precio = Number(productoActualizado.precio);
    }

    dataProductos.productos[indiceProducto] = productoActualizado;
    await guardarJson('productos.json', dataProductos);

    res.json({ mensaje: 'Producto actualizado correctamente', producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// DELETE /productos/:id
router.delete('/:id', async (req, res) => {
  try {
    const productoId = Number(req.params.id);
    const dataProductos = await leerJson('productos.json');
    const dataVentas = await leerJson('ventas.json');

    const productoExiste = dataProductos.productos.some((producto) => producto.id === productoId);

    if (!productoExiste) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const productoRelacionadoConVenta = dataVentas.ventas.some((venta) =>
      venta.items.some((item) => item.productoId === productoId)
    );

    if (productoRelacionadoConVenta) {
      return res.status(409).json({
        mensaje:
          'No se puede eliminar el producto porque está relacionado con una venta existente. Primero elimine/modifique la venta correspondiente.'
      });
    }

    dataProductos.productos = dataProductos.productos.filter((producto) => producto.id !== productoId);
    await guardarJson('productos.json', dataProductos);

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

export default router;
