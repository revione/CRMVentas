import { GraphQLError } from 'graphql';
import Pedido from '../models/Pedido.js';
import Cliente from '../models/Cliente.js';
import { verificarAutenticacion, verificarPropiedad } from '../middleware/auth.js';
import productoService from './productoService.js';

/**
 * Servicio para manejo de pedidos
 */
class PedidoService {
  /**
   * Obtiene todos los pedidos
   */
  async obtenerTodos() {
    return await Pedido.find({}).populate('cliente');
  }

  /**
   * Obtiene pedidos de un vendedor específico
   */
  async obtenerPorVendedor(vendedorId) {
    return await Pedido.find({ vendedor: vendedorId }).populate('cliente');
  }

  /**
   * Obtiene un pedido por ID
   */
  async obtenerPorId(id, ctx) {
    const pedido = await Pedido.findById(id).populate('cliente');

    if (!pedido) {
      throw new GraphQLError('Pedido no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(pedido.vendedor, ctx);

    return pedido;
  }

  /**
   * Obtiene pedidos por estado
   */
  async obtenerPorEstado(estado, ctx) {
    verificarAutenticacion(ctx);
    return await Pedido.find({ 
      vendedor: ctx.usuario.id, 
      estado 
    }).populate('cliente');
  }

  /**
   * Crea un nuevo pedido
   */
  async crear(input, ctx) {
    verificarAutenticacion(ctx);

    const { cliente: clienteId, pedido } = input;

    // Verificar que el cliente existe y pertenece al vendedor
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      throw new GraphQLError('Cliente no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(cliente.vendedor, ctx);

    // Verificar stock y actualizar productos
    await productoService.verificarYActualizarStock(pedido);

    // Crear pedido
    const nuevoPedido = new Pedido({
      ...input,
      vendedor: ctx.usuario.id,
    });

    return await nuevoPedido.save();
  }

  /**
   * Actualiza un pedido existente
   */
  async actualizar(id, input, ctx) {
    const { cliente: clienteId, pedido: nuevosPedidos } = input;

    // Verificar que el pedido existe
    const pedidoExistente = await Pedido.findById(id);
    if (!pedidoExistente) {
      throw new GraphQLError('Pedido no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(pedidoExistente.vendedor, ctx);

    // Verificar cliente
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      throw new GraphQLError('Cliente no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(cliente.vendedor, ctx);

    // Si hay cambios en el pedido, actualizar stock
    if (nuevosPedidos) {
      // Restaurar stock del pedido anterior
      await productoService.restaurarStock(pedidoExistente.pedido);

      // Verificar y descontar nuevo stock
      await productoService.verificarYActualizarStock(nuevosPedidos);
    }

    return await Pedido.findByIdAndUpdate(id, input, { 
      new: true,
      runValidators: true 
    }).populate('cliente');
  }

  /**
   * Elimina un pedido
   */
  async eliminar(id, ctx) {
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      throw new GraphQLError('Pedido no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(pedido.vendedor, ctx);

    await Pedido.findByIdAndDelete(id);
    return 'Pedido eliminado';
  }

  /**
   * Obtiene los mejores clientes
   */
  async obtenerMejoresClientes() {
    return await Pedido.aggregate([
      { $match: { estado: 'COMPLETADO' } },
      {
        $group: {
          _id: '$cliente',
          total: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'clientes',
          localField: '_id',
          foreignField: '_id',
          as: 'cliente',
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);
  }

  /**
   * Obtiene los mejores vendedores
   */
  async obtenerMejoresVendedores() {
    return await Pedido.aggregate([
      { $match: { estado: 'COMPLETADO' } },
      {
        $group: {
          _id: '$vendedor',
          total: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'vendedor',
        },
      },
      { $sort: { total: -1 } },
      { $limit: 3 },
    ]);
  }
}

export default new PedidoService();
