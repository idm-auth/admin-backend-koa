import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { AccountPolicyDtoTypes } from '@/domain/realm/account-policy/account-policy.dto';
import { AccountPolicyEntity, AccountPolicySchema } from '@/domain/realm/account-policy/account-policy.entity';
import { AccountPolicyRepository, AccountPolicyRepositorySymbol } from '@/domain/realm/account-policy/account-policy.repository';
import { inject } from 'inversify';

export const AccountPolicyServiceSymbol = Symbol.for('AccountPolicyService');

@Service(AccountPolicyServiceSymbol, { multiTenant: true })
export class AccountPolicyService extends AbstractCrudService<AccountPolicySchema, AccountPolicyDtoTypes> {
  @inject(AccountPolicyRepositorySymbol) protected repository!: AccountPolicyRepository;

  protected buildCreateData(dto: AccountPolicyDtoTypes['CreateRequestDto']): CreateInput<AccountPolicySchema> {
    return {
      accountId: dto.accountId,
      policyId: dto.policyId,
    };
  }

  protected buildUpdate(entity: AccountPolicyEntity, dto: AccountPolicyDtoTypes['UpdateRequestDto']): AccountPolicyEntity {
    return entity;
  }
}
