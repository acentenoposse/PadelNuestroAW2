import { apiClient } from './apiClient.js';

// Servicio de autenticación: login real contra /usuarios/login y manejo
// del usuario logueado en sessionStorage (necesario para generar la
// orden de compra con el usuarioId correcto). También guarda el token
// JWT que devuelve el backend, usado para las acciones protegidas.

const CLAVE_USUARIO = 'usuarioLogueado';
const CLAVE_TOKEN = 'token';

export const authService = {
  // Registra un nuevo usuario en el backend y deja la sesión iniciada
  // automáticamente (queda logueado al terminar el registro).
  async registrar(nombre, email, password) {
    const data = await apiClient.post('/usuarios', { nombre, email, password });
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    sessionStorage.setItem(CLAVE_TOKEN, data.token);
    return data.usuario;
  },

  async login(email, password) {
    const data = await apiClient.post('/usuarios/login', { email, password });
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    sessionStorage.setItem(CLAVE_TOKEN, data.token);
    return data.usuario;
  },

  getUsuario() {
    const raw = sessionStorage.getItem(CLAVE_USUARIO);
    return raw ? JSON.parse(raw) : null;
  },

  getToken() {
    return sessionStorage.getItem(CLAVE_TOKEN);
  },

  estaLogueado() {
    return this.getUsuario() !== null;
  },

  logout() {
    sessionStorage.removeItem(CLAVE_USUARIO);
    sessionStorage.removeItem(CLAVE_TOKEN);
  }
};
