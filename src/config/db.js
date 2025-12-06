import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Opciones ya incluidas por defecto en Mongoose 8+
      // useNewUrlParser y useUnifiedTopology removidos (deprecated)
    });
    
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1); // Salir si no puede conectar a la DB
  }
};

export default conectarDB;
