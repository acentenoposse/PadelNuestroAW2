import { navBarComponent } from './components/navbar.js';
import { footerComponent } from './components/footer.js';
import { authService } from './services/authService.js';
import { actualizarBadgeCarrito } from './utils/cardEvents.js';

window.addEventListener('load', () => {
  const header = document.querySelector('header');
  if (header) header.innerHTML = navBarComponent;

  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = footerComponent;

  // Logout: limpia la sesión y vuelve al login.
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      authService.logout();
    });
  }

  // Badge del carrito en la navbar.
  actualizarBadgeCarrito();
});
