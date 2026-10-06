import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${env.PORT}`);
  console.log(`   Health check: http://localhost:${env.PORT}/health`);
});
