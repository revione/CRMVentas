import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },
  existencia: {
    type: Number,
    required: [true, 'La existencia es obligatoria'],
    min: [0, 'La existencia no puede ser negativa'],
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  creado: {
    type: Date,
    default: Date.now,
  },
});

// Índice de texto para búsqueda
ProductoSchema.index({ nombre: 'text' });

export default mongoose.model('Producto', ProductoSchema);
