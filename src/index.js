import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers/index.js';
import { extraerToken, verificarToken } from './utils/auth.js';

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
await conectarDB();

// Crear servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    // Personalizar mensajes de error
    console.error('GraphQL Error:', {
      message: formattedError.message,
      code: formattedError.extensions?.code,
      path: formattedError.path,
    });

    return formattedError;
  },
});

// Iniciar servidor
const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    // Extraer y verificar token de autenticación
    const token = extraerToken(req.headers.authorization);
    const usuario = token ? verificarToken(token) : null;

    return {
      usuario,
    };
  },
});

console.log(`🚀 Servidor GraphQL listo en ${url}`);
console.log(`📊 Explora tu API en ${url}graphql`);
