import { RealmEntity } from '@/domain/core/realm/realm.entity';
import {
  RealmService,
  RealmServiceSymbol,
} from '@/domain/core/realm/realm.service';
import { getContainer } from '@test/setup/base.setup';
import { DocId } from '@idm-auth/koa-inversify-framework/common';
import {
  ExecutionContextProvider,
  ExecutionContextSymbol,
} from '@idm-auth/koa-inversify-framework/infrastructure';

/**
 * Cria uma realm de teste usando o RealmService diretamente.
 *
 * Por que usar service ao invés de HTTP request:
 * - Não passa por middlewares (autenticação, validação)
 * - Mais rápido (sem overhead de HTTP)
 * - Usa o banco core global (não precisa de setTestDatabase)
 *
 * Importante:
 * - Inicializa ExecutionContext manualmente (fora do contexto HTTP)
 * - RealmRepository precisa de ExecutionContext mesmo sendo core
 *
 * @param name Nome único da realm (use timestamp para evitar conflitos)
 * @param dbName Nome do banco de dados da realm
 * @returns RealmEntity criada
 */
export async function createTestRealm(
  name: string,
  dbName: string
): Promise<RealmEntity> {
  const container = getContainer();
  const executionContext = container.get<ExecutionContextProvider>(
    ExecutionContextSymbol
  );
  const realmService = container.get<RealmService>(RealmServiceSymbol);

  let realm: RealmEntity;

  // Inicializa ExecutionContext manualmente (fora do contexto HTTP)
  await executionContext.init({} as never, async () => {
    realm = await realmService.create({
      name,
      description: `Test realm: ${name}`,
      dbName,
    });
  });

  return realm!;
}

/**
 * Remove uma realm de teste e seu banco de dados.
 *
 * Por que usar deleteRealmAndDB:
 * - Remove realm do banco core
 * - Remove banco de dados da realm
 * - Cleanup completo sem deixar bancos órfãos
 *
 * @param id ID da realm (_id)
 */
export async function deleteTestRealm(id: DocId): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const container = getContainer();
  const executionContext = container.get<ExecutionContextProvider>(
    ExecutionContextSymbol
  );
  const realmService = container.get<RealmService>(RealmServiceSymbol);

  // Inicializa ExecutionContext manualmente (fora do contexto HTTP)
  await executionContext.init({} as never, async () => {
    await realmService.deleteRealmAndDB(id);
  });
}
