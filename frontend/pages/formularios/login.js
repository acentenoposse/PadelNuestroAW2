import { authService } from '../../services/authService.js';

const form = document.getElementById('formLogin');
const errorBox = document.getElementById('login-error');

function mostrarError(mensaje) {
  errorBox.textContent = mensaje;
  errorBox.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const email = document.getElementById('txtMail').value.trim();
  const password = document.getElementById('txtContrasena').value;

  if (!email || !password) {
    mostrarError('Completá email y contraseña.');
    return;
  }

  try {
    await authService.login(email, password);
    window.location.href = '/pages/home/home.html';
  } catch (error) {
    mostrarError(error.message || 'No se pudo iniciar sesión.');
  }
});
