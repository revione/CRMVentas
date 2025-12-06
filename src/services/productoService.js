import { GraphQLError } from 'graphql';
import Producto from '../models/Producto.js';

/**
 * Servicio para manejo de productos
 */
class ProductoService {
  /**
   * Obtiene todos los productos
   */
  async obtenerTodos() {
    return await Producto.find({});
  }

  /**
   * Obtiene un producto por ID
   */
  async obtenerPorId(id) {
    const producto = await Producto.findById(id);

    if (!producto) {
      throw new GraphQLError('Producto no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return producto;
  }

  /**
   * Crea un nuevo producto
   */
  async crear(input) {
    const producto = new Producto(input);
    return await producto.save();
  }

  /**
   * Actualiza un producto existente
   */
  async actualizar(id, input) {
    const producto = await Producto.findById(id);

    if (!producto) {
      throw new GraphQLError('Producto no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return await Producto.findByIdAndUpdate(id, input, { 
      new: true,
      runValidators: true 
    });
  }

  /**
   * Elimina un producto
   */
  async eliminar(id) {
    const producto = await Producto.findById(id);

    if (!producto) {
      throw new GraphQLError('Producto no encontrado', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    await Producto.findByIdAndDelete(id);
    return 'Producto eliminado';
  }

  /**
   * Busca productos por texto
   */
  async buscar(texto) {
    return await Producto.find({ $text: { $search: texto } }).limit(10);
  }

  /**
   * Verifica si hay stock suficiente y actualiza la existencia
   */
  async verificarYActualizarStock(articulos) {
    for (const articulo of articulos) {
      const producto = await this.obtenerPorId(articulo.id);

      if (articulo.cantidad > producto.existencia) {
        throw new GraphQLError(
          `El artículo ${producto.nombre} excede la cantidad disponible. Stock: ${producto.existencia}`,
          { extensions: { code: 'BAD_USER_INPUT' } }
        );
      }

      producto.existencia -= articulo.cantidad;
      await producto.save();
    }
  }

  /**
   * Restaura el stock de productos
   */
  async restaurarStock(articulos) {
    for (const articulo of articulos) {
      const producto = await this.obtenerPorId(articulo.id);
      producto.existencia += articulo.cantidad;
      await producto.save();
    }
  }
}

export default new ProductoService();
