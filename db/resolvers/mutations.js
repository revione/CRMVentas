const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const Producto = require('../../models/Producto');
const Cliente = require('../../models/Cliente');
const Pedido = require('../../models/Pedido');

require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

const Mutation = {
  nuevoUsuario: async (_, { input }) => {
    const { email, password } = input;

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      throw new Error('El usario ya esta registrado');
    }

    const salt = await bcryptjs.genSalt(10);
    input.password = await bcryptjs.hash(password, salt);

    try {
      const usuario = new Usuario(input);
      usuario.save();
      return usuario;
    } catch (error) {
      console.log(error);
    }
  },

  autenticarUsuario: async (_, { input }) => {
    const { email, password } = input;

    const existeUsuario = await Usuario.findOne({ email });
    if (!existeUsuario) {
      throw new Error('El usuario no existe');
    }

    const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
    if (!passwordCorrecto) {
      throw new Error('El password no es correcto');
    }

    return {
      token: crearToken(existeUsuario, process.env.SECRETA, '24h')
    };
  },

  nuevoProducto: async (_, { input }) => {
    try {
      const producto = new Producto(input);
      const resultado = await producto.save();

      return resultado;
    } catch (error) {
      console.log(error);
    }
  },

  actualizarProducto: async (_, { id, input }) => {
    let producto = await Producto.findById(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });

    return producto;
  },

  eliminarProducto: async (_, { id }) => {
    let producto = await Producto.findById(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await Producto.findOneAndDelete({ _id: id });

    return 'Producto Eliminado';
  },

  nuevoCliente: async (_, { input }, ctx) => {
    const { email } = input;

    const cliente = Cliente.findOne({ email });

    if (cliente) {
      throw new Error('Ese Cliente ya esta registrado');
    }

    const nuevoCliente = new Cliente(input);
    nuevoCliente.vendedor = ctx.usuario.id;

    try {
      const resultado = await nuevoCliente.save();
      return resultado;
    } catch (error) {
      console.log(error);
    }
  },

  actualizarCliente: async (_, { id, input }, ctx) => {
    let cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new Error('Ese Cliente no existe');
    }

    if (cliente.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
    return cliente;
  },

  eliminarCliente: async (_, { id }, ctx) => {
    let cliente = await Cliente.findById(id);

    if (!cliente) {
      throw new Error('Ese Cliente no existe');
    }

    if (cliente.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    await Cliente.findOneAndDelete({ _id: id });
    return 'Cliente eliminado';
  },

  nuevoPedido: async (_, { input }, ctx) => {
    const { cliente } = input;

    let clienteExiste = await Cliente.findById(cliente);

    if (!clienteExiste) {
      throw new Error('Ese Cliente no existe');
    }

    if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    for await (const articulo of input.pedido) {
      const { id } = articulo;

      const producto = await Producto.findById(id);

      if (articulo.cantidad > producto.existencia) {
        throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
      } else {
        producto.existencia = producto.existencia - articulo.cantidad;

        await producto.save();
      }
    }

    const nuevoPedido = new Pedido(input);
    nuevoPedido.vendedor = ctx.usuario.id;

    const resultado = await nuevoPedido.save();

    return resultado;
  },

  actualizarPedido: async (_, { id, input }, ctx) => {
    const { cliente } = input;
    const existePedido = await Pedido.findById(id);
    if (!existePedido) {
      throw new Error('El pedido no existe');
    }
    const existeCliente = await Cliente.findById(cliente);
    if (!existeCliente) {
      throw new Error('El cliente no existe');
    }

    if (existeCliente.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    if (input.pedido) {
      for await (const articulo of input.pedido) {
        const { id: articuloId } = articulo;

        const producto = await Producto.findById(articuloId);

        for await (const existente of existePedido.pedido) {
          const { id: idExistente } = existente;
          if (articuloId === idExistente) {
            producto.existencia = producto.existencia + existente.cantidad;
          }
        }

        if (articulo.cantidad > producto.existencia) {
          throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
        } else {
          producto.existencia = producto.existencia - articulo.cantidad;

          await producto.save();
        }
      }
    }

    const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
    return resultado;
  },

  eliminarPedido: async (_, { id }, ctx) => {
    let pedido = await Pedido.findById(id);

    if (!pedido) {
      throw new Error('Ese Pedido no existe');
    }

    if (pedido.vendedor.toString() !== ctx.usuario.id) {
      throw new Error('No tienes las credenciales');
    }

    await Pedido.findOneAndDelete({ _id: id });
    return 'Pedido eliminado';
  }
};

module.exports = { Mutation };
