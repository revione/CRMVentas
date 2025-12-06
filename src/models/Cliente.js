import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
  },
  empresa: {
    type: String,
    required: [true, 'La empresa es obligatoria'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
  },
  telefono: {
    type: String,
    trim: true,
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario',
  },
  creado: {
    type: Date,
    default: Date.now,
  },
});

// Índices para consultas comunes
ClienteSchema.index({ vendedor: 1 });
ClienteSchema.index({ email: 1 });

export default mongoose.model('Cliente', ClienteSchema);
