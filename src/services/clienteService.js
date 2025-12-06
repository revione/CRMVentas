import { GraphQLError } from 'graphql';
import Cliente from '../models/Cliente.js';
import { verificarAutenticacion, verificarPropiedad } from '../middleware/auth.js';

/**
 * Servicio para manejo de clientes
 */
class ClienteService {
  /**
   * Obtiene todos los clientes
   */
  async obtenerTodos() {
    return await Cliente.find({});
  }

  /**
   * Obtiene clientes de un vendedor específico
   */
  async obtenerPorVendedor(vendedorId) {
    return await Cliente.find({ vendedor: vendedorId });
  }

  /**
   * Obtiene un cliente por ID
   */
  async obtenerPorId(id, ctx) {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new GraphQLError('Cliente no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    // Verificar que el vendedor tenga acceso
    if (ctx?.usuario) {
      verificarPropiedad(cliente.vendedor, ctx);
    }

    return cliente;
  }

  /**
   * Crea un nuevo cliente
   */
  async crear(input, ctx) {
    verificarAutenticacion(ctx);

    const { email } = input;

    // Verificar si ya existe un cliente con ese email
    const clienteExistente = await Cliente.findOne({ email });
    if (clienteExistente) {
      throw new GraphQLError('Ya existe un cliente con ese email', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    // Crear cliente asociado al vendedor
    const nuevoCliente = new Cliente({
      ...input,
      vendedor: ctx.usuario.id,
    });

    return await nuevoCliente.save();
  }

  /**
   * Actualiza un cliente existente
   */
  async actualizar(id, input, ctx) {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new GraphQLError('Cliente no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(cliente.vendedor, ctx);

    return await Cliente.findByIdAndUpdate(id, input, { 
      new: true,
      runValidators: true 
    });
  }

  /**
   * Elimina un cliente
   */
  async eliminar(id, ctx) {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new GraphQLError('Cliente no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    verificarPropiedad(cliente.vendedor, ctx);

    await Cliente.findByIdAndDelete(id);
    return 'Cliente eliminado';
  }
}

export default new ClienteService();
