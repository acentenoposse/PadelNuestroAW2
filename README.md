# Padel Nuestro — E-commerce (Entrega 3)

Monorepo que vincula el **servidor** (backend Node + Express) con la
**interfaz** (frontend HTML/CSS/JS puro) de la tienda de pádel.

## Estructura (monorepo)

```
padel-nuestro/
├── package.json            # scripts raíz (instala y levanta todo)
├── backend/                # API REST (Node + Express, ES modules)
│   ├── index.js            # servidor: API + sirve la interfaz + CORS
│   ├── data/               # productos / categorias / usuarios / ventas (JSON)
│   ├── routes/             # productos, categorias, ventas, usuarios
│   └── utils/db.js
└── frontend/               # interfaz
    ├── config.js           # detecta el origen de la API
    ├── models/             # clases de dominio: Producto, Categoria
    ├── services/           # capa de servicios (fetch a la API)
    │   ├── apiClient.js
    │   ├── productosService.js
    │   ├── categoriasService.js
    │   ├── ventasService.js
    │   └── authService.js
    ├── components/         # navbar, card, footer, filtroCategorias, ...
    ├── utils/              # carritoStorage (localStorage), cardEvents, format
    └── pages/              # home, productos, categorias, carrito, formularios
```

### Por qué monorepo

Backend e interfaz viven en un solo repositorio y el **servidor Express
sirve además la interfaz estática**. Ventajas:

- Un solo comando para levantar todo.
- Mismo origen → sin problemas de CORS.
- La vinculación servidor ↔ interfaz queda explícita.

Igual se dejó **CORS habilitado** en el backend, así la interfaz también
funciona si se sirve aparte (Live Server, etc.).

## Cómo correrlo

Requiere Node.js 18+.

```bash
cd padel-nuestro
npm install        # instala dependencias del backend
npm start          # levanta el servidor
```

Abrir: **http://localhost:5555/** (el puerto sale de `backend/.env`).

Usuario de prueba: `juan@gmail.com` / `123456`
(otros en `backend/data/usuarios.json`).

### Alternativa: interfaz con Live Server

1. `npm start` (backend en :5555).
2. Abrir la carpeta `frontend/` con Live Server.
3. `frontend/config.js` detecta el origen y apunta la API a
   `http://localhost:5555` automáticamente (CORS ya habilitado).

## Cumplimiento de la consigna

| Requisito | Implementación |
|---|---|
| Listado de todos los productos | `pages/productos/productos.html` → `productosService.listar()` (GET `/productos`) |
| Filtrar por categoría / tipo | Filtro de chips en la página de productos + páginas de categoría dedicadas. El filtro lo resuelve el backend con `?categoriaId=` |
| Carrito en localStorage | `utils/carritoStorage.js` (items por `id` de producto) + badge en la navbar |
| Comprar → orden contra el back | Botón **Finalizar compra** en el carrito → `ventasService.crearOrden()` → POST `/ventas` con `usuarioId` + `items` |

### Adaptaciones realizadas

- **Modelo de dominio en el front**: clases `Producto` y `Categoria`
  que mapean el JSON del backend (helpers de imagen, precio, stock).
- **Categorías front + back**: el front consume `/categorias` del
  backend y arma los filtros dinámicamente (sin categorías hardcodeadas).
- **Datos**: se adaptó `backend/data/productos.json` para que las
  imágenes apunten a los assets reales de la interfaz.
- **Login real**: ahora autentica contra `/usuarios/login` y guarda el
  usuario en `sessionStorage` (necesario para generar la venta).
- **Registro de usuario**: el form de registro crea el usuario vía
  `POST /usuarios` (se persiste en `usuarios.json`) y deja la sesión
  iniciada automáticamente, listo para comprar. Valida email duplicado
  y largo mínimo de contraseña.
- **Capa de servicios**: un servicio por recurso sobre un `apiClient`
  común (manejo centralizado de errores y URL base).

## API (resumen)

- `GET  /productos` · `GET /productos?categoriaId=:id` · `GET /productos/:id`
- `GET  /categorias`
- `POST /usuarios` → `{ nombre, email, password }` (registro de usuario)
- `POST /usuarios/login` → `{ email, password }`
- `GET  /ventas` · `POST /ventas` → `{ usuarioId, items:[{ productoId, cantidad }] }`

El POST `/ventas` valida usuario, stock y cantidades antes de generar la
orden (productos con `stockActivo: false` no se pueden vender).
