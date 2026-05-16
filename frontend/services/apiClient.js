import { API_BASE_URL } from '../config.js';

// Cliente HTTP base. Centraliza la URL de la API, el manejo de JSON
// y de errores para que los servicios queden simples.

async function request(ruta, opciones = {}) {
  const url = `${API_BASE_URL}${ruta}`;

  let respuesta;
  try {
    respuesta = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones
    });
  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor. ¿Está corriendo el backend?'
    );
  }

  let datos = null;
  const texto = await respuesta.text();
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = texto;
    }
  }

  if (!respuesta.ok) {
    const mensaje =
      (datos && datos.mensaje) || `Error ${respuesta.status} en ${ruta}`;
    throw new Error(mensaje);
  }

  return datos;
}

export const apiClient = {
  get: (ruta) => request(ruta, { method: 'GET' }),
  post: (ruta, body) =>
    request(ruta, { method: 'POST', body: JSON.stringify(body) }),
  put: (ruta, body) =>
    request(ruta, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (ruta) => request(ruta, { method: 'DELETE' })
};
