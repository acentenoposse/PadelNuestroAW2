import { apiClient } from './apiClient.js';

// Servicio de autenticación: login real contra /usuarios/login y manejo
// del usuario logueado en sessionStorage (necesario para generar la
// orden de compra con el usuarioId correcto).

const CLAVE_USUARIO = 'usuarioLogueado';

export const authService = {
  // Registra un nuevo usuario en el backend y deja la sesión iniciada
  // automáticamente (queda logueado al terminar el registro).
  async registrar(nombre, email, password) {
    const data = await apiClient.post('/usuarios', { nombre, email, password });
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    return data.usuario;
  },

  async login(email, password) {
    const data = await apiClient.post('/usuarios/login', { email, password });
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    return data.usuario;
  },

  getUsuario() {
    const raw = sessionStorage.getItem(CLAVE_USUARIO);
    return raw ? JSON.parse(raw) : null;
  },

  estaLogueado() {
    return this.getUsuario() !== null;
  },

  logout() {
    sessionStorage.removeItem(CLAVE_USUARIO);
  }
};
