import pedidoService from '../../services/pedidoService.js';
import { verificarAutenticacion } from '../../middleware/auth.js';

export const pedidoQueries = {
  obtenerPedidos: () => {
    return pedidoService.obtenerTodos();
  },

  obtenerPedidosVendedor: (_, __, ctx) => {
    verificarAutenticacion(ctx);
    return pedidoService.obtenerPorVendedor(ctx.usuario.id);
  },

  obtenerPedido: (_, { id }, ctx) => {
    return pedidoService.obtenerPorId(id, ctx);
  },

  obtenerPedidosEstado: (_, { estado }, ctx) => {
    return pedidoService.obtenerPorEstado(estado, ctx);
  },

  mejoresClientes: () => {
    return pedidoService.obtenerMejoresClientes();
  },

  mejoresVendedores: () => {
    return pedidoService.obtenerMejoresVendedores();
  },
};

export const pedidoMutations = {
  nuevoPedido: (_, { input }, ctx) => {
    return pedidoService.crear(input, ctx);
  },

  actualizarPedido: (_, { id, input }, ctx) => {
    return pedidoService.actualizar(id, input, ctx);
  },

  eliminarPedido: (_, { id }, ctx) => {
    return pedidoService.eliminar(id, ctx);
  },
};
