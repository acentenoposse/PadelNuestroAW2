import { categoriaComponent } from '../../components/categorias.js';
import { categoriasService } from '../../services/categoriasService.js';

const categoriaContainer = document.getElementById('categoriaContainer');

// Datos de presentación (imagen + texto) por nombre de categoría.
// Las categorías en sí vienen del backend; esto solo decora las cards.
const presentacion = {
  Paletas: {
    img: '/assets/paletanox.webp',
    descripcion:
      'Elegí tu compañera para jugar al pádel al 100%: potencia, control o ambas, ¿por qué no?'
  },
  Zapatillas: {
    img: '/assets/zapatillas.webp',
    descripcion:
      'Movete en la pista rápido, ágil y con el mejor estilo. Todas las marcas y talles.'
  },
  Camisetas: {
    img: '/assets/camiseta.webp',
    descripcion:
      'Destacá con las camisetas que usan tus jugadores favoritos, con la mejor tela.'
  },
  Ofertas: {
    img: '/assets/asics.webp',
    descripcion: 'Los mejores precios de la temporada. Aprovechá antes de que se agoten.'
  },
  Novedades: {
    img: '/assets/vertex.webp',
    descripcion: 'Lo último que llegó a la tienda. Enterate primero.'
  },
  Profesional: {
    img: '/assets/adipower.webp',
    descripcion: 'Equipamiento de nivel competitivo usado por profesionales.'
  }
};

async function init() {
  try {
    const categorias = await categoriasService.listar();

    const cards = categorias
      .map((cat) => {
        const deco = presentacion[cat.nombre] || {
          img: '/assets/logo.png',
          descripcion: 'Descubrí todos los productos de esta categoría.'
        };
        return categoriaComponent({
          title: cat.nombre,
          img: deco.img,
          descripcion: deco.descripcion,
          url: `/pages/productos/productos.html?categoria=${cat.id}`
        });
      })
      .join('');

    categoriaContainer.innerHTML = cards;
  } catch (error) {
    categoriaContainer.innerHTML = `<p class="estado-error">No se pudieron cargar las categorías: ${error.message}</p>`;
  }
}

window.addEventListener('load', init);
