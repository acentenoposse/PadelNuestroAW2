import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models/Usuario.js';
import { obtenerSiguienteId } from '../utils/secuencia.js';
import { generarToken } from '../utils/jwt.js';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

// POST /usuarios  -> registro de un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ mensaje: 'Debe enviar nombre, email y password' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ mensaje: 'El email no tiene un formato válido' });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const emailEnUso = await Usuario.findOne({ email: emailNormalizado });

    if (emailEnUso) {
      return res
        .status(409)
        .json({ mensaje: 'Ya existe un usuario registrado con ese email' });
    }

    // Encriptamos la contraseña antes de guardarla (nunca en texto plano).
    const passwordHasheada = await bcrypt.hash(String(password), SALT_ROUNDS);

    const nuevoUsuario = await Usuario.create({
      id: await obtenerSiguienteId(Usuario),
      nombre: String(nombre).trim(),
      email: emailNormalizado,
      password: passwordHasheada,
      rol: 'cliente'
    });

    const token = generarToken(nuevoUsuario);
    const usuarioSinPassword = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    };

    res
      .status(201)
      .json({ mensaje: 'Usuario registrado correctamente', usuario: usuarioSinPassword, token });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// POST /usuarios/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Debe enviar email y password' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const usuario = await Usuario.findOne({ email: emailNormalizado });

    // Comparamos la contraseña recibida contra el hash almacenado.
    const passwordCorrecta = usuario
      ? await bcrypt.compare(String(password), usuario.password)
      : false;

    if (!usuario || !passwordCorrecta) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    const usuarioSinPassword = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    res.json({ mensaje: 'Login correcto', usuario: usuarioSinPassword, token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

export default router;
