const navElements = [
  { title: 'Home',       link: '/pages/home/home.html' },
  { title: 'Productos',  link: '/pages/productos/productos.html' },
  { title: 'Paletas',    link: '/pages/categorias/paletas.html' },
  { title: 'Remeras',    link: '/pages/categorias/camisetas.html' },
  { title: 'Zapatillas', link: '/pages/categorias/zapatillas.html' }
];

export const navBarComponent = `
<nav>
    <a class="logo" href="/pages/home/home.html" aria-label="Padel Nuestro - Inicio">
        <img src="/assets/logo.svg" alt="Padel Nuestro">
    </a>

    <div class="links">
        <ul class="listalinks">
            ${navElements
              .map((e) => `<li><a href="${e.link}">${e.title}</a></li>`)
              .join('')}
        </ul>

        <a class="boton-nav" href="/pages/formularios/formulario.html">Registrarse</a>
        <a class="boton-nav" id="btn-logout" href="/pages/formularios/login.html">Logout</a>

        <a class="nav-cart" href="/pages/carrito/carrito.html" aria-label="Ver carrito">
            <img src="/assets/cart.svg" alt="">
            <span class="cart-badge" id="cart-badge" hidden>0</span>
        </a>
    </div>
</nav>
`;
