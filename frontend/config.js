// Configuración global de la interfaz.
//
// Si la interfaz la sirve el propio backend (mismo origen) usamos rutas
// relativas. Si se sirve aparte (Live Server, VSCode, file://) apuntamos
// al backend Express en localhost:5555. Cambiá BACKEND_URL si tu .env
// usa otro puerto.

const BACKEND_URL = 'http://localhost:5555';

function resolverApiBase() {
  // Servido por el backend Express -> mismo origen, ruta relativa.
  if (typeof window !== 'undefined' && window.location.port === '5555') {
    return '';
  }
  // Servido aparte (Live Server / file://) -> apuntar al backend.
  return BACKEND_URL;
}

export const API_BASE_URL = resolverApiBase();

// Carpeta de imágenes de la interfaz (las imágenes son assets del frontend).
export const ASSETS_BASE = '/assets';
