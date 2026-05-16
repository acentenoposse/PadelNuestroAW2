import { cardComponent } from '../../components/card.js';
import { filtroCategoriasComponent } from '../../components/filtroCategorias.js';
import { productosService } from '../../services/productosService.js';
import { categoriasService } from '../../services/categoriasService.js';
import {
  configurarEventosCarrito,
  inicializarContadores
} from '../../utils/cardEvents.js';

const cardContainer = document.getElementById('cardContainer');
const filtroContainer = document.getElementById('filtroContainer');
const buscador = document.getElementById('buscador');
const estado = document.getElementById('estado');

// Estado de la vista
let todosLosProductos = [];
let categoriaActiva = null; // id de categoría o null = todas
let textoBusqueda = '';

// Mapa id -> Producto (para que el carrito guarde el item completo)
const mapaProductos = new Map();

function aplicarFiltros() {
  let lista = todosLosProductos;

  if (categoriaActiva) {
    lista = lista.filter((p) => p.perteneceA(categoriaActiva));
  }

  if (textoBusqueda) {
    const t = textoBusqueda.toLowerCase();
    lista = lista.filter(
      (p) =>
        p.nombre.toLowerCase().includes(t) ||
        p.descripcion.toLowerCase().includes(t)
    );
  }

  render(lista);
}

function render(lista) {
  if (lista.length === 0) {
    cardContainer.innerHTML = '';
    estado.hidden = false;
    estado.textContent = 'No hay productos que coincidan con el filtro.';
    return;
  }
  estado.hidden = true;
  cardContainer.innerHTML = lista.map(cardComponent).join('');
  inicializarContadores(cardContainer);
}

function leerCategoriaDeUrl() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('categoria');
  return cat ? Number(cat) : null;
}

async function init() {
  try {
    const [productos, categorias] = await Promise.all([
      productosService.listar(),
      categoriasService.listar()
    ]);

    todosLosProductos = productos;
    productos.forEach((p) => mapaProductos.set(p.id, p));

    categoriaActiva = leerCategoriaDeUrl();

    // Render del filtro de categorías
    filtroContainer.innerHTML = filtroCategoriasComponent(
      categorias,
      categoriaActiva
    );

    filtroContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-categoria');
      if (!chip) return;

      filtroContainer
        .querySelectorAll('.chip-categoria')
        .forEach((c) => c.classList.remove('activo'));
      chip.classList.add('activo');

      categoriaActiva = chip.dataset.categoria
        ? Number(chip.dataset.categoria)
        : null;
      aplicarFiltros();
    });

    // Eventos del carrito (una sola vez, delegados en el contenedor)
    configurarEventosCarrito(cardContainer, mapaProductos);

    // Búsqueda
    buscador.addEventListener('input', (e) => {
      textoBusqueda = e.target.value.trim();
      aplicarFiltros();
    });

    aplicarFiltros();
  } catch (error) {
    estado.hidden = false;
    estado.className = 'estado-error';
    estado.textContent = `No se pudieron cargar los productos: ${error.message}`;
  }
}

window.addEventListener('load', init);
