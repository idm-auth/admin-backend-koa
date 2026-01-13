import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { inject } from 'inversify';
import { PolicyService, PolicyServiceSymbol } from '@/domain/realm/policy/policy.service';
import { AccountRoleService, AccountRoleServiceSymbol } from '@/domain/realm/account-role/account-role.service';
import { AccountPolicyService, AccountPolicyServiceSymbol } from '@/domain/realm/account-policy/account-policy.service';
import { AccountGroupService, AccountGroupServiceSymbol } from '@/domain/realm/account-group/account-group.service';
import { GroupRoleService, GroupRoleServiceSymbol } from '@/domain/realm/group-role/group-role.service';
import { GroupPolicyService, GroupPolicyServiceSymbol } from '@/domain/realm/group-policy/group-policy.service';
import { RolePolicyService, RolePolicyServiceSymbol } from '@/domain/realm/role-policy/role-policy.service';
import { PolicyEntity } from '@/domain/realm/policy/policy.entity';
import { EvaluateRequest, EvaluateResponse } from '@/domain/realm/authz/authz.dto';

export const AuthzServiceSymbol = Symbol.for('AuthzService');

@Service(AuthzServiceSymbol, { multiTenant: true })
export class AuthzService extends AbstractService {
  @inject(PolicyServiceSymbol) private policyService!: PolicyService;
  @inject(AccountRoleServiceSymbol) private accountRoleService!: AccountRoleService;
  @inject(AccountPolicyServiceSymbol) private accountPolicyService!: AccountPolicyService;
  @inject(AccountGroupServiceSymbol) private accountGroupService!: AccountGroupService;
  @inject(GroupRoleServiceSymbol) private groupRoleService!: GroupRoleService;
  @inject(GroupPolicyServiceSymbol) private groupPolicyService!: GroupPolicyService;
  @inject(RolePolicyServiceSymbol) private rolePolicyService!: RolePolicyService;

  @TraceAsync('authz.service.evaluate')
  async evaluate(request: EvaluateRequest): Promise<EvaluateResponse> {
    this.log.debug({ request }, 'Evaluating authorization');

    // TODO: Remove this stub after framework integration is complete
    // For now, always return allowed=true to test framework
    return { allowed: true };

    // TODO: Uncomment below for full policy evaluation
    /*
    try {
      const policies = await this.getPoliciesForAccount(request.accountId);
      
      if (policies.length === 0) {
        this.log.debug({ accountId: request.accountId }, 'No policies found - implicit deny');
        return { allowed: false, error: 'No policies found' };
      }

      const context = {
        tenantId: this.tenantId,
        accountId: request.accountId,
        partition: request.partition || 'global',
        region: request.region || '',
      };

      const result = this.evaluatePolicies(policies, request.action, request.resource, context);
      
      this.log.info({ 
        accountId: request.accountId, 
        action: request.action, 
        resource: request.resource,
        allowed: result.allowed 
      }, 'Authorization evaluated');

      return result;
    } catch (error) {
      this.log.error({ error, request }, 'Error evaluating authorization');
      return { allowed: false, error: 'Internal error' };
    }
    */
  }

  private async getPoliciesForAccount(accountId: string): Promise<PolicyEntity[]> {
    const policyIds = new Set<string>();

    // 1. Direct account policies
    const accountPolicies = await this.accountPolicyService.findByAccountId(accountId);
    accountPolicies.forEach(ap => policyIds.add(ap.policyId.toString()));

    // 2. Policies via account roles
    const accountRoles = await this.accountRoleService.findByAccountId(accountId);
    for (const ar of accountRoles) {
      const rolePolicies = await this.rolePolicyService.findByRoleId(ar.roleId.toString());
      rolePolicies.forEach(rp => policyIds.add(rp.policyId.toString()));
    }

    // 3. Policies via account groups
    const accountGroups = await this.accountGroupService.findByAccountId(accountId);
    for (const ag of accountGroups) {
      // Direct group policies
      const groupPolicies = await this.groupPolicyService.findByGroupId(ag.groupId.toString());
      groupPolicies.forEach(gp => policyIds.add(gp.policyId.toString()));

      // Policies via group roles
      const groupRoles = await this.groupRoleService.findByGroupId(ag.groupId.toString());
      for (const gr of groupRoles) {
        const rolePolicies = await this.rolePolicyService.findByRoleId(gr.roleId.toString());
        rolePolicies.forEach(rp => policyIds.add(rp.policyId.toString()));
      }
    }

    // Fetch all unique policies
    const policies: PolicyEntity[] = [];
    for (const policyId of policyIds) {
      const policy = await this.policyService.findById(policyId);
      policies.push(policy);
    }

    return policies;
  }

  private evaluatePolicies(
    policies: PolicyEntity[],
    action: string,
    resource: string,
    context: Record<string, string>
  ): EvaluateResponse {
    // Resolve variables in policies
    const resolvedPolicies = policies.map(p => ({
      ...p,
      resources: p.resources.map(r => this.resolveVariables(r, context)),
    }));

    // Filter matching policies
    const matchingPolicies = resolvedPolicies.filter(p =>
      this.matchAction(p.actions, action) && this.matchResource(p.resources, resource)
    );

    // 1. Check for explicit Deny
    const hasDeny = matchingPolicies.some(p => p.effect === 'Deny');
    if (hasDeny) {
      return { allowed: false, error: 'Explicit deny' };
    }

    // 2. Check for explicit Allow
    const hasAllow = matchingPolicies.some(p => p.effect === 'Allow');
    if (hasAllow) {
      return { allowed: true };
    }

    // 3. Implicit deny (default)
    return { allowed: false, error: 'Implicit deny' };
  }

  private matchAction(policyActions: string[], requestAction: string): boolean {
    return policyActions.some(pa => {
      const pattern = pa.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(requestAction);
    });
  }

  private matchResource(policyResources: string[], requestResource: string): boolean {
    return policyResources.some(pr => {
      const pattern = pr.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(requestResource);
    });
  }

  private resolveVariables(template: string, context: Record<string, string>): string {
    return template.replace(/\${(\w+)}/g, (_, key) => context[key] || '');
  }
}
