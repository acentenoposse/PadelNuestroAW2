import jwt from 'jsonwebtoken';

// Middleware que protege rutas que requieren un usuario logueado.
// Espera el token en el header: Authorization: Bearer <token>
// Si es válido, deja los datos del usuario en req.usuario y continúa.
export function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [esquema, token] = header.split(' ');

  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token inválido o ausente' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o ausente' });
  }
}
