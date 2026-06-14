import { Router } from 'express';
import { Categoria } from '../models/Categoria.js';

const router = Router();

// GET /categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find().select('-_id').lean();
    res.json({ categorias });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
  }
});

export default router;
