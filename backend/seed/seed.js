import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { Usuario } from '../models/Usuario.js';
import { Producto } from '../models/Producto.js';
import { Categoria } from '../models/Categoria.js';
import { Venta } from '../models/Venta.js';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

const SALT_ROUNDS = 10;

async function leerJson(nombreArchivo) {
  const contenido = await fs.readFile(path.join(dataDir, nombreArchivo), 'utf-8');
  return JSON.parse(contenido);
}

// Migra los datos de los archivos JSON a MongoDB. Las contraseñas de los
// usuarios, que en los JSON están en texto plano, se guardan hasheadas.
async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Falta la variable MONGO_URI en el archivo .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Conectado a MongoDB. Iniciando migración...');

  // Vaciamos las colecciones para que el seed sea idempotente.
  await Promise.all([
    Usuario.deleteMany({}),
    Producto.deleteMany({}),
    Categoria.deleteMany({}),
    Venta.deleteMany({})
  ]);

  const { categorias } = await leerJson('categorias.json');
  const { productos } = await leerJson('productos.json');
  const { ventas } = await leerJson('ventas.json');
  const { usuarios } = await leerJson('usuarios.json');

  await Categoria.insertMany(categorias);
  console.log(`Categorías migradas: ${categorias.length}`);

  await Producto.insertMany(productos);
  console.log(`Productos migrados: ${productos.length}`);

  await Venta.insertMany(ventas);
  console.log(`Ventas migradas: ${ventas.length}`);

  // Re-hasheamos la contraseña de cada usuario antes de insertarlo.
  const usuariosHasheados = await Promise.all(
    usuarios.map(async (usuario) => ({
      ...usuario,
      password: await bcrypt.hash(String(usuario.password), SALT_ROUNDS)
    }))
  );
  await Usuario.insertMany(usuariosHasheados);
  console.log(`Usuarios migrados (con contraseña hasheada): ${usuarios.length}`);

  await mongoose.disconnect();
  console.log('Migración finalizada correctamente.');
}

seed().catch(async (error) => {
  console.error('Error durante la migración:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
