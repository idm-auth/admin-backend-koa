import { getContainer } from '@test/setup/base.setup';
import { AppEnv, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { EnvKey } from '@idm-auth/koa-inversify-framework/common';
import {
  MongoDB,
  MongoDBSymbol,
} from '@idm-auth/koa-inversify-framework/infrastructure';

/**
 * Configura um banco de dados isolado para testes.
 *
 * Por que isso existe:
 * - Cada arquivo de teste precisa de isolamento de dados
 * - Evita que testes interfiram uns nos outros
 * - Permite execução paralela de testes sem conflitos
 *
 * Como funciona:
 * 1. Obtém o container do Inversify (já inicializado no base.setup)
 * 2. Recupera a instância do AppEnv (gerenciador de variáveis de ambiente)
 * 3. Usa setMemValue() para sobrescrever MONGODB_CORE_DBNAME em memória
 * 4. Quando o repository executar, ele lerá o novo valor e usará o banco isolado
 *
 * Importante:
 * - Não reconecta o MongoDB, apenas muda o nome do banco usado
 * - A mudança é em memória (memCache), não afeta process.env
 * - Cada operação de banco lê o valor atualizado dinamicamente
 *
 * @param dbName - Nome do banco de dados isolado (ex: 'vi-test-db-core-realm-post')
 *
 * @example
 * beforeAll(() => {
 *   setTestDatabase('vi-test-db-core-realm-post');
 * });
 */
export function setTestDatabase(dbName: string): void {
  const container = getContainer();
  const env = container.get<AppEnv>(AppEnvSymbol);
  env.setMemValue(EnvKey.MONGODB_CORE_DBNAME, dbName);
}

/**
 * Apaga o banco de dados de teste após a execução.
 *
 * Por que isso existe:
 * - Limpa dados de teste após cada arquivo de teste
 * - Evita acúmulo de bancos de dados de teste no MongoDB
 * - Mantém o ambiente de teste limpo
 *
 * Como funciona:
 * 1. Obtém a instância do MongoDB do container
 * 2. Lê o nome do banco atual (configurado via setTestDatabase)
 * 3. Usa getDbConn() para obter conexão com o banco específico
 * 4. Usa dropDatabase() para apagar completamente o banco
 *
 * Importante:
 * - Deve ser chamado no afterAll de cada arquivo de teste
 * - Apaga TODOS os dados do banco configurado
 * - Não afeta outros bancos de teste rodando em paralelo
 *
 * @example
 * afterAll(async () => {
 *   await dropTestDatabase();
 * });
 */
export async function dropTestDatabase(): Promise<void> {
  const container = getContainer();
  const mongodb = container.get<MongoDB>(MongoDBSymbol);
  const env = container.get<AppEnv>(AppEnvSymbol);

  // Obtém o nome do banco atual (configurado no beforeAll)
  const dbName = env.get(EnvKey.MONGODB_CORE_DBNAME);

  // Obtém conexão com o banco específico e apaga completamente
  const dbConn = mongodb.getDbConn(dbName);
  await dbConn.dropDatabase();
}
