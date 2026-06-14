import jwt from 'jsonwebtoken';

// Genera un token JWT firmado con el secret de .env. El payload lleva
// los datos mínimos del usuario necesarios para identificar quién hace
// la acción (id, email, rol). Expira en 2 horas.
export function generarToken(usuario) {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}
