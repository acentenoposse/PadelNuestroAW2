import { Router } from 'express';
import { leerJson } from '../utils/db.js';

const router = Router();

// GET /categorias
router.get('/', async (req, res) => {
  try {
    const { categorias } = await leerJson('categorias.json');
    res.json({ categorias });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
  }
});

export default router;
