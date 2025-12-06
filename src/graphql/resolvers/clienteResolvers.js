import clienteService from '../../services/clienteService.js';
import { verificarAutenticacion } from '../../middleware/auth.js';

export const clienteQueries = {
  obtenerClientes: () => {
    return clienteService.obtenerTodos();
  },

  obtenerClientesVendedor: (_, __, ctx) => {
    verificarAutenticacion(ctx);
    return clienteService.obtenerPorVendedor(ctx.usuario.id);
  },

  obtenerCliente: (_, { id }, ctx) => {
    return clienteService.obtenerPorId(id, ctx);
  },
};

export const clienteMutations = {
  nuevoCliente: (_, { input }, ctx) => {
    return clienteService.crear(input, ctx);
  },

  actualizarCliente: (_, { id, input }, ctx) => {
    return clienteService.actualizar(id, input, ctx);
  },

  eliminarCliente: (_, { id }, ctx) => {
    return clienteService.eliminar(id, ctx);
  },
};
