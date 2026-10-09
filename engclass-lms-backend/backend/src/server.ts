import app from './app';
import { env } from './config/env';

// Ubah dari:
// app.listen(env.PORT, () => { ... });

// Menjadi:
app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://localhost:${env.PORT}`);
  console.log(`   Network: http://0.0.0.0:${env.PORT}`);
  console.log(`   Health check: http://localhost:${env.PORT}/health`);
});