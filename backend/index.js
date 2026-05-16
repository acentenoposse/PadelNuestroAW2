import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productosRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// El frontend vive al lado del backend dentro del monorepo
const frontendDir = path.join(__dirname, '..', 'frontend');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// API 
app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API de e-commerce de pádel funcionando correctamente',
    rutas: {
      productos: '/productos',
      ventas: '/ventas',
      usuarios: '/usuarios',
      categorias: '/categorias'
    }
  });
});

app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);


app.use(express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});


app.use((req, res) => {
  if (req.path.startsWith('/productos') ||
      req.path.startsWith('/ventas') ||
      req.path.startsWith('/usuarios') ||
      req.path.startsWith('/categorias') ||
      req.path.startsWith('/api')) {
    return res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }
  res.status(404).sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Interfaz disponible en  http://localhost:${port}/`);
});
