import { Container } from 'inversify';
import { RealmModule } from '@/domain/core/realm/realm.module';

export async function initCoreModules(container: Container): Promise<void> {
  new RealmModule(container);
}
