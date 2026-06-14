import { API_BASE_URL } from '../config.js';

// Cliente HTTP base. Centraliza la URL de la API, el manejo de JSON
// y de errores para que los servicios queden simples.

async function request(ruta, opciones = {}) {
  const url = `${API_BASE_URL}${ruta}`;

  // Si hay un token guardado (usuario logueado), lo enviamos en el header
  // Authorization para las rutas protegidas por JWT. Leemos directamente de
  // sessionStorage para no acoplar el apiClient con el authService.
  const headers = { 'Content-Type': 'application/json' };
  const token = sessionStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(url, {
      headers,
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
