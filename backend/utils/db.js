import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

export async function leerJson(nombreArchivo) {
  const rutaArchivo = path.join(dataDir, nombreArchivo);
  const contenido = await fs.readFile(rutaArchivo, 'utf-8');
  return JSON.parse(contenido);
}

export async function guardarJson(nombreArchivo, datos) {
  const rutaArchivo = path.join(dataDir, nombreArchivo);
  await fs.writeFile(rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
}

export function obtenerSiguienteId(registros) {
  if (!registros.length) return 1;
  return Math.max(...registros.map((registro) => Number(registro.id))) + 1;
}
