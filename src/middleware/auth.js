import { GraphQLError } from 'graphql';

/**
 * Verifica que el usuario esté autenticado
 * Lanza error si no hay usuario en el contexto
 */
export const verificarAutenticacion = (ctx) => {
  if (!ctx.usuario) {
    throw new GraphQLError('No autenticado. Debes iniciar sesión.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
};

/**
 * Verifica que el usuario sea dueño del recurso
 * @param {String} vendedorId - ID del vendedor del recurso
 * @param {Object} ctx - Contexto de GraphQL
 */
export const verificarPropiedad = (vendedorId, ctx) => {
  verificarAutenticacion(ctx);
  
  if (vendedorId.toString() !== ctx.usuario.id) {
    throw new GraphQLError('No tienes permisos para acceder a este recurso.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
};
