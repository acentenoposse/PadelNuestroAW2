# CLAUDE.md

Este archivo le brinda orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Descripción general

Padel Nuestro es un e-commerce de artículos de pádel, construido como un **monorepo** que une un backend Express con un frontend en JS/HTML/CSS vanilla originalmente hecho en AW1. No hay paso de build ni framework en ninguno de los dos lados — el backend sirve los archivos estáticos del frontend directamente. La persistencia es **MongoDB** (vía Mongoose), con autenticación por **JWT** y contraseñas hasheadas con **bcrypt**.

## Comandos

Ejecutar todo desde la raíz del repo (el `package.json` raíz delega a `backend/` mediante `--prefix`):

- `npm install` — instala las dependencias de la raíz + backend (`postinstall` ejecuta `install:backend`). El frontend no tiene dependencias.
- `npm start` — inicia el servidor (`node backend/index.js`).
- `npm run dev` — inicia con `nodemon` para recarga automática.
- `npm run seed --prefix backend` — migra los `backend/data/*.json` a MongoDB (vacía las colecciones y re-hashea las contraseñas). Correr una vez antes del primer arranque.

Requiere **MongoDB corriendo en local** (`mongodb://localhost:27017`). El servidor conecta a Mongo (`conectarDB()`) **antes** de escuchar; si la base no está disponible, el proceso termina con código 1.

El servidor escucha en `process.env.PORT` (definido en `5555` en `backend/.env`), con valor por defecto `3000`. Una vez en ejecución, toda la app — API **y** UI — se sirve desde un único origen en `http://localhost:<PORT>/`.

`backend/.env` define `PORT`, `MONGO_URI` y `JWT_SECRET` (este último lo genera cada quien; no commitear secrets reales).

**No hay tests ni linter**. `npm test` en el backend es un stub vacío que termina con código 0.

## Arquitectura

### Diseño de origen único (importante)
`backend/index.js` monta primero las rutas de la API, luego `express.static(frontendDir)` sirviendo `../frontend`, y por último un manejador catch-all 404. El catch-all devuelve 404 en JSON para rutas bajo los prefijos de la API (`/productos`, `/ventas`, `/usuarios`, `/categorias`, `/api`) y, en caso contrario, hace fallback a `frontend/index.html`. El CORS está totalmente abierto (`*`) para que el frontend también funcione si se abre desde otro origen/puerto.

`frontend/config.js` refleja esto: `API_BASE_URL` es `''` (mismo origen) cuando la página se sirve en el puerto `5555`, y de lo contrario apunta a `http://localhost:5555`. Si cambiás el puerto del backend, actualizá también la comprobación de `5555` en `config.js`.

### Backend — MongoDB + Mongoose
La persistencia es MongoDB. `backend/config/mongoose.js` (`conectarDB()`) abre la conexión con `MONGO_URI`. Los modelos viven en `backend/models/` (`Usuario`, `Producto`, `Categoria`, `Venta`), uno por colección.

**Criterio clave — id numérico propio:** cada documento conserva un campo **`id` numérico** (`1, 2, ...`) además del `_id` de Mongo. El frontend referencia todo por ese `id` (carrito, `categorias: [1,5,6]`, `usuarioId`, `productoId`), así que el `_id` de Mongo **no** se usa como identificador de negocio. Los nuevos id salen de `obtenerSiguienteId(Model)` en `utils/secuencia.js` (busca el id máximo y suma 1). Las respuestas excluyen `_id` con `.select('-_id')`.

Las rutas devuelven mensajes JSON en español bajo la clave `mensaje`. Reglas de negocio destacadas:
- **Productos** (`productos.routes.js`): `GET /productos` admite los filtros `?categoriaId=` y `?stockActivo=`. El `DELETE` se bloquea con 409 si el producto aparece en alguna venta (`Venta.exists({'items.productoId': id})`). `POST/PUT/DELETE` están protegidos con JWT (ver más abajo); los `GET` son públicos.
- **Ventas** (`ventas.routes.js`): `POST /ventas` valida que el `usuarioId` exista, que cada `productoId` exista y tenga `stockActivo: true`, y recalcula el `total` en el servidor (los precios enviados por el cliente se ignoran). **Requiere JWT** (comprar es la acción clave de la consigna).
- **Usuarios** (`usuarios.routes.js`): `POST /usuarios` (registro) y `POST /usuarios/login`. Las contraseñas se hashean con `bcrypt.hash` al registrar y se validan con `bcrypt.compare` al loguear. Ambos endpoints devuelven `{ usuario (sin password), token }`. Los usuarios tienen un `rol` (`admin` | `cliente`).
- **Categorías** (`categorias.routes.js`): solo lectura, únicamente `GET`.

### Autenticación JWT
- `utils/jwt.js` → `generarToken(usuario)` firma `{ id, email, rol }` con `JWT_SECRET` (expira en 2h).
- `middlewares/auth.js` → `verificarToken` lee `Authorization: Bearer <token>`, lo valida y deja `req.usuario`; si falta o es inválido responde `401 { mensaje: 'Token inválido o ausente' }`.
- Rutas protegidas: `POST /ventas` y `POST/PUT/DELETE /productos`.
- El frontend manda el token automáticamente: `apiClient.js` agrega el header `Authorization` leyendo `sessionStorage.token`. `authService` guarda `usuario` + `token` al loguear/registrar y los borra en `logout`.

### Migración / seed
`backend/seed/seed.js` (`npm run seed`) vacía las colecciones, carga los `backend/data/*.json` conservando los id numéricos, y re-hashea las contraseñas de los usuarios (en los JSON están en texto plano). Idempotente: se puede correr las veces que haga falta. Los JSON quedan solo como fuente del seed, ya no como base de datos viva.

### Formas de los datos
- Producto: `{ id, nombre, descripcion, precio, img, categorias: number[], stockActivo: boolean }` — `categorias` es un array de IDs de categoría; `img` es un nombre de archivo que se resuelve bajo `/assets`.
- Venta: `{ id, usuarioId, fecha, total, items: [{ productoId, cantidad, precio }] }`.
- Categoría: `{ id, nombre }`.
- Usuario: `{ id, nombre, email, password (hash bcrypt), rol }`.

### Frontend — módulos ES vanilla, sin framework
Páginas con `<script type="module">` plano bajo `frontend/pages/{home,productos,carrito,categorias,formularios}/`. `frontend/index.html` redirige de inmediato a la página de login. Estructura por capas:

- **services/** — `apiClient.js` es el único wrapper HTTP (centraliza `API_BASE_URL`, el parseo de JSON y el manejo de errores); los servicios de dominio (`productosService`, `ventasService`, `categoriasService`, `authService`) se construyen sobre él. Agregá nuevas llamadas a la API a través de `apiClient`, no con `fetch` directo.
- **components/** — funciones que devuelven strings (p. ej. `navBarComponent`, `footerComponent`, `card.js`) inyectadas vía `innerHTML`. `frontend/index.js` cablea el navbar/footer/logout compartidos en cada página en el evento `load`.
- **utils/carritoStorage.js** — el carrito vive enteramente en `localStorage` (clave `carritoCompra`); el backend solo recibe el carrito en el checkout vía `POST /ventas`.
- **services/authService.js** — el usuario logueado se guarda en `sessionStorage` (clave `usuarioLogueado`) junto con el `token` JWT (clave `token`); el `id` del usuario es lo que se envía como `usuarioId` al crear una venta.
- **models/**, **utils/format.js**, **utils/cardEvents.js** — view models y helpers de presentación.

### Agregar un nuevo recurso de la API
1. Crear el modelo Mongoose en `backend/models/<Recurso>.js` (con su `id` numérico propio).
2. Agregar `backend/routes/<recurso>.routes.js` usando queries Mongoose e `obtenerSiguienteId(Model)`; aplicar `verificarToken` a las acciones que requieran usuario logueado.
3. Registrarlo en `backend/index.js` (`app.use('/<recurso>', ...)`) **y** agregar el prefijo a la comprobación del catch-all 404.
4. Agregar un `frontend/services/<recurso>Service.js` sobre `apiClient`.
5. Si hay datos iniciales, sumarlos al seed (`backend/seed/seed.js`).
