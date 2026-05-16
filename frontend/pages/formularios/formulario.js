import { authService } from '../../services/authService.js';

const form = document.getElementById('formRegistro');
const errorBox = document.getElementById('registro-error');

function mostrarError(mensaje) {
  errorBox.textContent = mensaje;
  errorBox.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const nombre = document.getElementById('txtNombre').value.trim();
  const email = document.getElementById('txtMail').value.trim();
  const password = document.getElementById('txtContrasena2').value;

  // Validación básica del lado del cliente (el backend revalida igual)
  if (!nombre || !email || !password) {
    mostrarError('Completá nombre, email y contraseña.');
    return;
  }

  if (password.length < 6) {
    mostrarError('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  try {
    // registrar() crea el usuario en el backend y deja la sesión iniciada
    await authService.registrar(nombre, email, password);
    window.location.href = '/pages/home/home.html';
  } catch (error) {
    mostrarError(error.message || 'No se pudo completar el registro.');
  }
});
