import jwt from 'jsonwebtoken';

/**
 * Crea un token JWT con la información del usuario
 * @param {Object} usuario - Objeto de usuario de la DB
 * @returns {String} Token JWT firmado
 */
export const crearToken = (usuario) => {
  const { id, email, nombre, apellido } = usuario;
  
  return jwt.sign(
    { id, email, nombre, apellido },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token a verificar
 * @returns {Object|null} Usuario decodificado o null si es inválido
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token inválido:', error.message);
    return null;
  }
};

/**
 * Extrae el token del header Authorization
 * @param {String} authHeader - Header de autorización
 * @returns {String|null} Token extraído o null
 */
export const extraerToken = (authHeader) => {
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  return token || null;
};
