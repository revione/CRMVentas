import bcryptjs from 'bcryptjs';
import { GraphQLError } from 'graphql';
import Usuario from '../models/Usuario.js';
import { crearToken } from '../utils/auth.js';

/**
 * Servicio para manejo de usuarios
 */
class UsuarioService {
  /**
   * Crea un nuevo usuario
   */
  async crearUsuario(input) {
    const { email, password } = input;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw new GraphQLError('El usuario ya está registrado', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    // Hash de la contraseña
    const salt = await bcryptjs.genSalt(10);
    input.password = await bcryptjs.hash(password, salt);

    // Crear usuario
    const usuario = new Usuario(input);
    await usuario.save();

    return usuario;
  }

  /**
   * Autentica un usuario y devuelve un token
   */
  async autenticarUsuario(input) {
    const { email, password } = input;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new GraphQLError('El usuario no existe', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passwordCorrecto) {
      throw new GraphQLError('La contraseña es incorrecta', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    // Generar token
    return {
      token: crearToken(usuario),
    };
  }
}

export default new UsuarioService();
