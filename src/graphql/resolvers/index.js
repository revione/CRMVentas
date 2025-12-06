import { usuarioQueries, usuarioMutations } from './usuarioResolvers.js';
import { productoQueries, productoMutations } from './productoResolvers.js';
import { clienteQueries, clienteMutations } from './clienteResolvers.js';
import { pedidoQueries, pedidoMutations } from './pedidoResolvers.js';

const resolvers = {
  Query: {
    // Usuario
    ...usuarioQueries,
    
    // Productos
    ...productoQueries,
    
    // Clientes
    ...clienteQueries,
    
    // Pedidos
    ...pedidoQueries,
  },

  Mutation: {
    // Usuario
    ...usuarioMutations,
    
    // Productos
    ...productoMutations,
    
    // Clientes
    ...clienteMutations,
    
    // Pedidos
    ...pedidoMutations,
  },
};

export default resolvers;
