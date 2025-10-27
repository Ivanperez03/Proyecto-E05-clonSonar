import { app } from './app';
import { ENV } from './config/env';
import { testDB } from './config/db';

async function bootstrap() {
  await testDB(); // comprobamos conexión a Postgres al arrancar

  app.listen(ENV.PORT, () => {
    console.log(`[API] Fragments escuchando en puerto ${ENV.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error arrancando el servidor:', err);
  process.exit(1);
});