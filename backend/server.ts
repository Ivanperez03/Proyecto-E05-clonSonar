import app from './src/app';
import { ENV } from './src/config/env';
import { testDB } from './src/config/db';

(async () => {
  await testDB();
  app.listen(ENV.PORT, () => console.log(`API escuchando en :${ENV.PORT}`));
})();
//cambio de comprobación