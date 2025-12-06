# 📊 CRM GraphQL API

> Sistema de gestión de relaciones con clientes (CRM) con API GraphQL, autenticación JWT y gestión de productos, clientes y pedidos.

[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)](https://graphql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🚀 Tech Stack

- **Server**: Apollo Server 4 (GraphQL)
- **Database**: MongoDB + Mongoose 8
- **Auth**: JSON Web Tokens (JWT)
- **Runtime**: Node.js ≥18
- **Language**: JavaScript (ES Modules)
- **Security**: bcryptjs para hashing de contraseñas

## ✨ Características

- 🔐 Autenticación y autorización con JWT
- 👥 Gestión de usuarios (vendedores)
- 📦 CRUD de productos con control de inventario
- 🏢 CRUD de clientes por vendedor
- 📋 Sistema de pedidos con validación de stock
- 📊 Estadísticas (mejores clientes y vendedores)
- 🔍 Búsqueda de productos
- ✅ Validaciones robustas en modelos
- 🏗️ Arquitectura en capas (Services, Resolvers, Models)

## 📁 Arquitectura

```
src/
├── config/              # Configuración (DB connection)
│   └── db.js
│
├── models/             # Mongoose Schemas
│   ├── Usuario.js      # Vendedores del sistema
│   ├── Producto.js     # Catálogo de productos
│   ├── Cliente.js      # Clientes por vendedor
│   └── Pedido.js       # Pedidos con items
│
├── services/           # Lógica de negocio
│   ├── usuarioService.js
│   ├── productoService.js
│   ├── clienteService.js
│   └── pedidoService.js
│
├── graphql/
│   ├── schema.js       # Schema de GraphQL (tipos e inputs)
│   └── resolvers/      # Resolvers por dominio
│       ├── index.js
│       ├── usuarioResolvers.js
│       ├── productoResolvers.js
│       ├── clienteResolvers.js
│       └── pedidoResolvers.js
│
├── middleware/         # Middleware personalizado
│   └── auth.js        # Autenticación y autorización
│
├── utils/             # Utilidades
│   └── auth.js       # JWT helpers (crear, verificar, extraer)
│
└── index.js          # Entry point del servidor
```

### Patrón de Arquitectura

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     GraphQL (Apollo Server)         │
│  • Schema (types, inputs, enums)    │
│  • Context (JWT verification)       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Resolvers Layer             │
│  • Mapeo GraphQL → Services         │
│  • Validación de permisos           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Services Layer              │
│  • Lógica de negocio                │
│  • Validaciones complejas           │
│  • Orquestación de modelos          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Models (Mongoose)           │
│  • Schemas y validaciones           │
│  • Índices de DB                    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│          MongoDB                    │
└─────────────────────────────────────┘
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js ≥18.0.0
- MongoDB (local o Atlas)
- npm/pnpm/yarn

### Pasos

1. **Clonar e instalar**

```bash
git clone <repo-url>
cd crmgraphql
npm install
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env`:

```env
MONGO_URI=mongodb://localhost:27017/crmgraphql
JWT_SECRET=tu_clave_secreta_super_segura_y_larga
PORT=4000
NODE_ENV=development
```

3. **Iniciar servidor**

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará en: `http://localhost:4000/graphql`

## 📖 API GraphQL

### Endpoint

```
http://localhost:4000/graphql
```

### Autenticación

La mayoría de operaciones requieren JWT. Incluir en headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

### 👤 Usuarios (Vendedores)

#### Registrar usuario

```graphql
mutation {
  nuevoUsuario(
    input: {
      nombre: "Juan"
      apellido: "Pérez"
      email: "juan@example.com"
      password: "password123"
    }
  ) {
    id
    nombre
    apellido
    email
  }
}
```

#### Autenticar (Login)

```graphql
mutation {
  autenticarUsuario(
    input: { email: "juan@example.com", password: "password123" }
  ) {
    token
  }
}
```

#### Obtener usuario actual (requiere auth)

```graphql
query {
  obtenerUsuario {
    id
    nombre
    apellido
    email
    creado
  }
}
```

---

### 📦 Productos

#### Listar todos los productos

```graphql
query {
  obtenerProductos {
    id
    nombre
    existencia
    precio
    creado
  }
}
```

#### Obtener un producto

```graphql
query {
  obtenerProducto(id: "507f1f77bcf86cd799439011") {
    id
    nombre
    existencia
    precio
  }
}
```

#### Crear producto

```graphql
mutation {
  nuevoProducto(
    input: { nombre: "Laptop Dell XPS 15", existencia: 25, precio: 1299.99 }
  ) {
    id
    nombre
    precio
  }
}
```

#### Actualizar producto

```graphql
mutation {
  actualizarProducto(
    id: "507f1f77bcf86cd799439011"
    input: {
      nombre: "Laptop Dell XPS 15 (Actualizado)"
      existencia: 30
      precio: 1199.99
    }
  ) {
    id
    nombre
    precio
  }
}
```

#### Eliminar producto

```graphql
mutation {
  eliminarProducto(id: "507f1f77bcf86cd799439011")
}
```

#### Buscar productos

```graphql
query {
  buscarProducto(texto: "laptop") {
    id
    nombre
    precio
  }
}
```

---

### 🏢 Clientes

#### Listar todos los clientes

```graphql
query {
  obtenerClientes {
    id
    nombre
    apellido
    empresa
    email
    telefono
  }
}
```

#### Clientes del vendedor actual (requiere auth)

```graphql
query {
  obtenerClientesVendedor {
    id
    nombre
    apellido
    empresa
    email
  }
}
```

#### Obtener un cliente (requiere auth + ownership)

```graphql
query {
  obtenerCliente(id: "507f1f77bcf86cd799439011") {
    id
    nombre
    apellido
    empresa
    email
    telefono
  }
}
```

#### Crear cliente (requiere auth)

```graphql
mutation {
  nuevoCliente(
    input: {
      nombre: "María"
      apellido: "García"
      empresa: "Tech Solutions"
      email: "maria@techsolutions.com"
      telefono: "+1234567890"
    }
  ) {
    id
    nombre
    empresa
  }
}
```

#### Actualizar cliente (requiere auth + ownership)

```graphql
mutation {
  actualizarCliente(
    id: "507f1f77bcf86cd799439011"
    input: { telefono: "+9876543210" }
  ) {
    id
    telefono
  }
}
```

#### Eliminar cliente (requiere auth + ownership)

```graphql
mutation {
  eliminarCliente(id: "507f1f77bcf86cd799439011")
}
```

---

### 📋 Pedidos

#### Listar todos los pedidos

```graphql
query {
  obtenerPedidos {
    id
    total
    estado
    fecha
    cliente {
      nombre
      empresa
    }
  }
}
```

#### Pedidos del vendedor (requiere auth)

```graphql
query {
  obtenerPedidosVendedor {
    id
    total
    estado
    cliente {
      nombre
    }
    pedido {
      nombre
      cantidad
      precio
    }
  }
}
```

#### Obtener un pedido (requiere auth + ownership)

```graphql
query {
  obtenerPedido(id: "507f1f77bcf86cd799439011") {
    id
    total
    estado
    pedido {
      id
      cantidad
      nombre
      precio
    }
  }
}
```

#### Pedidos por estado (requiere auth)

```graphql
query {
  obtenerPedidosEstado(estado: "COMPLETADO") {
    id
    total
    fecha
  }
}
```

Estados: `PENDIENTE`, `COMPLETADO`, `CANCELADO`

#### Crear pedido (requiere auth, valida stock)

```graphql
mutation {
  nuevoPedido(
    input: {
      cliente: "507f1f77bcf86cd799439011"
      total: 2599.98
      estado: PENDIENTE
      pedido: [
        {
          id: "product_id_1"
          cantidad: 2
          nombre: "Laptop Dell"
          precio: 1299.99
        }
      ]
    }
  ) {
    id
    total
    estado
  }
}
```

#### Actualizar pedido (requiere auth + ownership)

```graphql
mutation {
  actualizarPedido(
    id: "507f1f77bcf86cd799439011"
    input: { estado: COMPLETADO }
  ) {
    id
    estado
  }
}
```

#### Eliminar pedido (requiere auth + ownership)

```graphql
mutation {
  eliminarPedido(id: "507f1f77bcf86cd799439011")
}
```

---

### 📊 Estadísticas

#### Mejores clientes (top 10 por ventas)

```graphql
query {
  mejoresClientes {
    total
    cliente {
      nombre
      empresa
      email
    }
  }
}
```

#### Mejores vendedores (top 3)

```graphql
query {
  mejoresVendedores {
    total
    vendedor {
      nombre
      apellido
      email
    }
  }
}
```

## 🔐 Seguridad y Autorizaciones

### Flujo de Autenticación

1. Usuario se registra con `nuevoUsuario`
2. Usuario hace login con `autenticarUsuario` → recibe JWT
3. Cliente incluye JWT en header `Authorization: Bearer <token>`
4. Server valida JWT y añade `usuario` al context
5. Resolvers/Services verifican autenticación y permisos

### Niveles de Protección

| Operación                 | Requiere Auth | Requiere Ownership |
| ------------------------- | ------------- | ------------------ |
| `nuevoUsuario`            | ❌            | ❌                 |
| `autenticarUsuario`       | ❌            | ❌                 |
| `obtenerUsuario`          | ✅            | -                  |
| `obtenerProductos`        | ❌            | ❌                 |
| `nuevoProducto`           | ❌            | ❌                 |
| `obtenerClientesVendedor` | ✅            | -                  |
| `obtenerCliente`          | ✅            | ✅                 |
| `nuevoCliente`            | ✅            | -                  |
| `actualizarCliente`       | ✅            | ✅                 |
| `obtenerPedidosVendedor`  | ✅            | -                  |
| `nuevoPedido`             | ✅            | ✅ (del cliente)   |
| `mejoresClientes`         | ❌            | ❌                 |

**Ownership**: El recurso debe pertenecer al vendedor autenticado

### Características de Seguridad

- ✅ Passwords hasheadas con bcryptjs (salt rounds: 10)
- ✅ JWT con expiración de 24h
- ✅ Validación de email format en modelos
- ✅ Validación de campos únicos (email)
- ✅ Middleware de autorización reutilizable
- ✅ Errores GraphQL con códigos apropiados (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`)

## 📝 Scripts Disponibles

```bash
npm start          # Inicia servidor en producción
npm run dev        # Inicia con nodemon (auto-reload)
npm run lint       # Ejecuta ESLint
npm run format     # Formatea código con Prettier
```

## 🏗️ Modelos de Datos

### Usuario

```javascript
{
  nombre: String (requerido),
  apellido: String (requerido),
  email: String (único, requerido, formato email),
  password: String (hasheado, min 6 caracteres),
  creado: Date
}
```

### Producto

```javascript
{
  nombre: String (requerido),
  existencia: Number (min: 0),
  precio: Number (min: 0),
  creado: Date
}
```

### Cliente

```javascript
{
  nombre: String (requerido),
  apellido: String (requerido),
  empresa: String (requerido),
  email: String (único, formato email),
  telefono: String,
  vendedor: ObjectId (ref: Usuario),
  creado: Date
}
```

### Pedido

```javascript
{
  pedido: [{
    id: ObjectId (ref: Producto),
    cantidad: Number (min: 1),
    nombre: String,
    precio: Number
  }],
  total: Number (min: 0),
  cliente: ObjectId (ref: Cliente),
  vendedor: ObjectId (ref: Usuario),
  estado: Enum [PENDIENTE, COMPLETADO, CANCELADO],
  fecha: Date
}
```

## 🧪 Testing

```bash
# TODO: Añadir tests
npm test
```

## 🚀 Deployment

### Variables de Entorno Requeridas

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=production_secret_muy_seguro
PORT=4000
NODE_ENV=production
```

### Recomendaciones

- Usar MongoDB Atlas para producción
- Generar JWT_SECRET fuerte (min 32 caracteres aleatorios)
- Configurar CORS apropiadamente
- Habilitar rate limiting
- Configurar logs estructurados

## 🛠️ Dependencias

### Producción

| Paquete        | Versión | Uso                  |
| -------------- | ------- | -------------------- |
| @apollo/server | ^4.10.0 | Servidor GraphQL     |
| mongoose       | ^8.1.1  | ODM MongoDB          |
| jsonwebtoken   | ^9.0.3  | Autenticación JWT    |
| bcryptjs       | ^2.4.3  | Hash de passwords    |
| graphql        | ^16.8.1 | GraphQL core         |
| dotenv         | ^16.4.5 | Variables de entorno |
| express        | ^4.18.2 | HTTP server          |

### Desarrollo

| Paquete  | Versión | Uso             |
| -------- | ------- | --------------- |
| nodemon  | ^3.0.3  | Auto-reload     |
| eslint   | ^8.56.0 | Linting         |
| prettier | ^3.2.4  | Code formatting |

## 📚 Recursos

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [JWT.io](https://jwt.io/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## ✍️ Autor

**Revi**

---

**Hecho con ❤️ usando Apollo Server + MongoDB**
