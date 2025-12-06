import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  pedido: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidad: {
        type: Number,
        required: true,
        min: [1, 'La cantidad debe ser al menos 1'],
      },
      nombre: {
        type: String,
        required: true,
      },
      precio: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo'],
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo'],
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Cliente',
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario',
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
    default: 'PENDIENTE',
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

// Índices para consultas comunes
PedidoSchema.index({ vendedor: 1, estado: 1 });
PedidoSchema.index({ cliente: 1 });

export default mongoose.model('Pedido', PedidoSchema);
