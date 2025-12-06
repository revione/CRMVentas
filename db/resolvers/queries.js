const Producto = require('../../models/Producto');
const Cliente = require('../../models/Cliente');
const Pedido = require('../../models/Pedido');

const Query = {
  obtenerUsuario: async (_, {}, ctx) => ctx.usuario,

  obtenerProductos: async () => {
    try {
      const productos = await Producto.find({});
      return productos;
    } catch (error) {
      console.log(error);
    }
  },

  obtenerProducto: async (_, { id }) => {
    const producto = await Producto.findById(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto;
  },

  obtenerClientes: async () => {
    try {
      const clientes = await Cliente.find({});
      return clientes;
    } catch (error) {
      console.log(error);
    }
  },

  obtenerClientesVendedor: async (_, {}, ctx) => {
    try {
      const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });
      return clientes;
    } catch (error) {
      console.log(error);
    }
  },

  obtenerCliente: async (_, { id }, ctx) => {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    if (cliente.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    return cliente;
  },

  obtenerPedidos: async () => {
    try {
      const pedidos = await Pedido.find({});
      return pedidos;
    } catch (error) {
      console.log(error);
    }
  },

  obtenerPedidosVendedor: async (_, {}, ctx) => {
    try {
      const pedidos = await Pedido.find({ vendedor: ctx.usuario.id }).populate('cliente');
      return pedidos;
    } catch (error) {
      console.log(error);
    }
  },

  obtenerPedido: async (_, { id }, ctx) => {
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    if (pedido.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tiene las credenciales, accion no permitida');
    }

    return pedido;
  },

  obtenerPedidosEstado: async (_, { estado }, ctx) => {
    const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });
    return pedidos;
  },

  mejoresClientes: async () => {
    const clientes = await Pedido.aggregate([
      { $match: { estado: 'COMPLETADO' } },
      {
        $group: {
          _id: '$cliente',
          total: { $sum: '$total' }
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: '_id',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      { $limit: 10 },
      { $sort: { total: -1 } }
    ]);
    return clientes;
  },

  mejoresVendedores: async () => {
    const vendedores = await Pedido.aggregate([
      { $match: { estado: 'COMPLETADO' } },
      {
        $group: {
          _id: '$vendedor',
          total: { $sum: '$total' }
        }
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'vendedor'
        }
      },
      { $limit: 3 },
      { $sort: { total: -1 } }
    ]);

    return vendedores;
  },

  buscarProducto: async (_, { texto }) => {
    const productos = await Producto.find({ $text: { $search: texto } }).limit(10);
    return productos;
  }
};

module.exports = { Query };
