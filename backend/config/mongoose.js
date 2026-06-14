import mongoose from 'mongoose';

// Conexión a MongoDB. La URI viene de la variable de entorno MONGO_URI
// (ver backend/.env). Si la conexión falla, cortamos el proceso porque
// sin base de datos el backend no puede funcionar.
export async function conectarDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('Falta la variable MONGO_URI en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB correctamente');
  } catch (error) {
    console.error('No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  }
}
