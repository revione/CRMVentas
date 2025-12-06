import productoService from '../../services/productoService.js';

export const productoQueries = {
  obtenerProductos: () => {
    return productoService.obtenerTodos();
  },

  obtenerProducto: (_, { id }) => {
    return productoService.obtenerPorId(id);
  },

  buscarProducto: (_, { texto }) => {
    return productoService.buscar(texto);
  },
};

export const productoMutations = {
  nuevoProducto: (_, { input }) => {
    return productoService.crear(input);
  },

  actualizarProducto: (_, { id, input }) => {
    return productoService.actualizar(id, input);
  },

  eliminarProducto: (_, { id }) => {
    return productoService.eliminar(id);
  },
};
