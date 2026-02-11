import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  PolicySchema,
  policySchema,
  PolicyEntity,
} from '@/domain/realm/policy/policy.entity';
import { IdmAuthAction } from '@idm-auth/auth-client';
import { DocId } from '@idm-auth/koa-inversify-framework/common';
import { inject } from 'inversify';
import {
  PolicyActionRepository,
  PolicyActionRepositorySymbol,
} from '@/domain/realm/policy-action/policy-action.repository';

export const PolicyRepositorySymbol = Symbol.for('PolicyRepository');

@Repository(PolicyRepositorySymbol, { multiTenant: true })
export class PolicyRepository extends AbstractCrudMongoRepository<PolicySchema> {
  @inject(PolicyActionRepositorySymbol)
  private policyActionRepository!: PolicyActionRepository;

  constructor() {
    super(policySchema, 'policy');
  }

  async findByAccountAndActions(
    accountId: DocId,
    action: IdmAuthAction
  ): Promise<PolicyEntity[]> {
    const policyActionCollection =
      await this.policyActionRepository.getCollection();

    const pipeline = [
      {
        $match: {
          $or: [
            {
              system: action.system,
              resource: action.resource,
              operation: action.operation,
            },
            {
              system: action.system,
              resource: action.resource,
              operation: '*',
            },
            { system: action.system, resource: '*', operation: '*' },
            { system: '*', resource: '*', operation: '*' },
          ],
        },
      },
      {
        $group: {
          _id: '$policyId',
        },
      },
      {
        $lookup: {
          from: 'account-policy',
          let: { policyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$policyId', '$$policyId'] },
                    { $eq: ['$accountId', accountId] },
                  ],
                },
              },
            },
          ],
          as: 'accountPolicies',
        },
      },
      {
        $lookup: {
          from: 'account-group',
          let: { policyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$accountId', accountId] },
              },
            },
            {
              $lookup: {
                from: 'group-policy',
                let: { groupId: '$groupId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$groupId', '$$groupId'] },
                          { $eq: ['$policyId', '$$policyId'] },
                        ],
                      },
                    },
                  },
                ],
                as: 'groupPolicies',
              },
            },
            {
              $match: {
                groupPolicies: { $ne: [] },
              },
            },
          ],
          as: 'accountGroups',
        },
      },
      {
        $match: {
          $or: [
            { accountPolicies: { $ne: [] } },
            { accountGroups: { $ne: [] } },
          ],
        },
      },
      {
        $lookup: {
          from: 'policy',
          localField: '_id',
          foreignField: '_id',
          as: 'policies',
        },
      },
      {
        $unwind: '$policies',
      },
      {
        $replaceRoot: { newRoot: '$policies' },
      },
    ];
    this.log.debug({ pipeline }, 'findByAccountAndActions: Pipeline');
    const result =
      await policyActionCollection.aggregate<PolicyEntity>(pipeline);
    this.log.debug(
      { policies: result },
      'findByAccountAndActions: Policies result'
    );
    return result;
  }
}
