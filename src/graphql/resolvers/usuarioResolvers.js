import usuarioService from '../../services/usuarioService.js';
import { verificarAutenticacion } from '../../middleware/auth.js';

export const usuarioQueries = {
  obtenerUsuario: (_, __, ctx) => {
    verificarAutenticacion(ctx);
    return ctx.usuario;
  },
};

export const usuarioMutations = {
  nuevoUsuario: (_, { input }) => {
    return usuarioService.crearUsuario(input);
  },

  autenticarUsuario: (_, { input }) => {
    return usuarioService.autenticarUsuario(input);
  },
};
