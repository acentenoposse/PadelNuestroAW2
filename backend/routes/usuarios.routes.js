import { Router } from 'express';
import { leerJson, guardarJson, obtenerSiguienteId } from '../utils/db.js';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const dataUsuarios = await leerJson('usuarios.json');

    const emailNormalizado = String(email).trim().toLowerCase();
    const emailEnUso = dataUsuarios.usuarios.some(
      (usuario) => usuario.email.toLowerCase() === emailNormalizado
    );

    if (emailEnUso) {
      return res
        .status(409)
        .json({ mensaje: 'Ya existe un usuario registrado con ese email' });
    }

    const nuevoUsuario = {
      id: obtenerSiguienteId(dataUsuarios.usuarios),
      nombre: String(nombre).trim(),
      email: emailNormalizado,
      password: String(password),
      rol: 'cliente'
    };

    dataUsuarios.usuarios.push(nuevoUsuario);
    await guardarJson('usuarios.json', dataUsuarios);

    const { password: _password, ...usuarioSinPassword } = nuevoUsuario;
    res
      .status(201)
      .json({ mensaje: 'Usuario registrado correctamente', usuario: usuarioSinPassword });
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

    const { usuarios } = await leerJson('usuarios.json');
    const emailNormalizado = String(email).trim().toLowerCase();
    const usuario = usuarios.find(
      (usuarioActual) =>
        usuarioActual.email.toLowerCase() === emailNormalizado &&
        usuarioActual.password === password
    );

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const { password: _password, ...usuarioSinPassword } = usuario;
    res.json({ mensaje: 'Login correcto', usuario: usuarioSinPassword });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

export default router;
