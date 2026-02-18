import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import { RoleSchema, roleSchema } from '@/domain/realm/role/role.entity';

export const RoleRepositorySymbol = Symbol.for('RoleRepository');

@Repository(RoleRepositorySymbol, { multiTenant: true })
export class RoleRepository extends AbstractCrudMongoRepository<RoleSchema> {
  constructor() {
    super(roleSchema, 'role');
  }
}
