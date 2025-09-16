import * as dotenvLib from 'dotenv';
import path from 'path';

// cria apenas uma conexão principal
const init = async () => {
  // sempre carrega o .env padrão
  dotenvLib.config({ path: path.resolve(process.cwd(), '.env') });

  // se NODE_ENV=development, carrega também o .env.development
  if (process.env.NODE_ENV === 'development') {
    dotenvLib.config({ path: path.resolve(process.cwd(), '.env.development') });
  }
};

export const dotenv = { init };
