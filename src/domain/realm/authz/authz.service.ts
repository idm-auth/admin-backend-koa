import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import {
  EvaluateRequest,
  EvaluateResponse,
} from '@/domain/realm/authz/authz.dto';
import { JwtService, JwtServiceSymbol } from '@/domain/realm/jwt/jwt.service';
import {
  PolicyService,
  PolicyServiceSymbol,
} from '@/domain/realm/policy/policy.service';
import { inject } from 'inversify';
import {
  parseAction,
  parseGrn,
  IdmAuthAction,
  IdmAuthGrn,
} from '@idm-auth/client';
import { AbstractService } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';

export const AuthzServiceSymbol = Symbol.for('AuthzService');

@Service(AuthzServiceSymbol, { multiTenant: true })
export class AuthzService extends AbstractService {
  @inject(PolicyServiceSymbol) private policyService!: PolicyService;
  @inject(JwtServiceSymbol) private jwtService!: JwtService;
  @inject(AccountServiceSymbol) private accountService!: AccountService;

  @TraceAsync('authz.service.evaluate')
  async evaluate(
    tenantId: string,
    request: EvaluateRequest
  ): Promise<EvaluateResponse> {
    const payload = await this.jwtService.verifyToken(request.userToken);
    const action = parseAction(request.action);
    const grn = parseGrn(request.grn);

    return this.evaluateByAccount(request, action, grn, payload.accountId);
  }

  private async evaluateByAccount(
    request: EvaluateRequest,
    action: IdmAuthAction,
    grn: IdmAuthGrn,
    accountId: string
  ): Promise<EvaluateResponse> {
    const account = await this.accountService.findById(accountId);
    this.log.info(
      { accountId: account._id, email: account.emails[0]?.email },
      'User authenticated'
    );

    const policies = await this.policyService.findByAccountAndActions(
      accountId,
      action
    );
    this.log.debug({ policies }, 'evaluateByAccount: Policies found');

    if (policies.length === 0) {
      this.log.debug({ accountId }, 'No policies found - implicit deny');
      return { allowed: false };
    }

    const hasAllow = policies.some((p) => p.effect === 'Allow');
    const hasDeny = policies.some((p) => p.effect === 'Deny');

    if (hasDeny) {
      return { allowed: false };
    }

    if (hasAllow) {
      return { allowed: true };
    }

    return { allowed: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async evaluateByRole(roleId: string): Promise<EvaluateResponse> {
    return { allowed: true };
  }

  @TraceAsync('authz.service.evaluate')
  async evaluateOLD(
    tenantId: string,
    request: EvaluateRequest
  ): Promise<EvaluateResponse> {
    // Receives: tenantId (UUID), userToken (JWT), grn (Global Resource Name)
    // userToken contains accountId and expiration; grn specifies the resource being accessed
    this.log.debug({ tenantId, request }, 'Evaluating authorization');

    // TODO: Complete authorization evaluation flow
    // Input: tenantId=7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5, userToken (JWT with accountId), grn=grn:global:idm-auth-core-api::7c2ab839-5fb5-4b4d-90ce-00b7c693f6d5:applications/*
    // Steps needed:
    // 1. Decode userToken JWT to extract accountId
    // 2. Parse grn to extract resource and action
    // 3. Create test policy for applications/* resource
    // 4. Link policy to account (direct or via role/group)
    // 5. Implement getPoliciesForAccount to retrieve policies
    // 6. Implement evaluatePolicies to match grn against policy resources
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

  // private async getPoliciesForAccount(accountId: string): Promise<PolicyEntity[]> {
  //   const policyIds = new Set<string>();

  //   // 1. Direct account policies
  //   const accountPolicies = await this.accountPolicyService.findByAccountId(accountId);
  //   accountPolicies.forEach(ap => policyIds.add(ap.policyId.toString()));

  //   // 2. Policies via account roles
  //   const accountRoles = await this.accountRoleService.findByAccountId(accountId);
  //   for (const ar of accountRoles) {
  //     const rolePolicies = await this.rolePolicyService.findByRoleId(ar.roleId.toString());
  //     rolePolicies.forEach(rp => policyIds.add(rp.policyId.toString()));
  //   }

  //   // 3. Policies via account groups
  //   const accountGroups = await this.accountGroupService.findByAccountId(accountId);
  //   for (const ag of accountGroups) {
  //     // Direct group policies
  //     const groupPolicies = await this.groupPolicyService.findByGroupId(ag.groupId.toString());
  //     groupPolicies.forEach(gp => policyIds.add(gp.policyId.toString()));

  //     // Policies via group roles
  //     const groupRoles = await this.groupRoleService.findByGroupId(ag.groupId.toString());
  //     for (const gr of groupRoles) {
  //       const rolePolicies = await this.rolePolicyService.findByRoleId(gr.roleId.toString());
  //       rolePolicies.forEach(rp => policyIds.add(rp.policyId.toString()));
  //     }
  //   }

  //   // Fetch all unique policies
  //   const policies: PolicyEntity[] = [];
  //   for (const policyId of policyIds) {
  //     const policy = await this.policyService.findById(policyId);
  //     policies.push(policy);
  //   }

  //   return policies;
  // }

  private evaluatePolicies() // policies: PolicyEntity[],
  // action: string,
  // resource: string,
  // context: Record<string, string>
  : EvaluateResponse {
    // Resolve variables in policies
    // const resolvedPolicies = policies.map((p) => ({
    //   ...p,
    //   resources: p.resources.map((r) => this.resolveVariables(r, context)),
    // }));

    // // Filter matching policies
    // const matchingPolicies = resolvedPolicies.filter(
    //   (p) =>
    //     this.matchAction(p.actions, action) &&
    //     this.matchResource(p.resources, resource)
    // );

    // // 1. Check for explicit Deny
    // const hasDeny = matchingPolicies.some((p) => p.effect === 'Deny');
    // if (hasDeny) {
    //   return { allowed: false, error: 'Explicit deny' };
    // }

    // // 2. Check for explicit Allow
    // const hasAllow = matchingPolicies.some((p) => p.effect === 'Allow');
    // if (hasAllow) {
    //   return { allowed: true };
    // }

    // 3. Implicit deny (default)
    return { allowed: false, error: 'Implicit deny' };
  }

  private matchAction(policyActions: string[], requestAction: string): boolean {
    return policyActions.some((pa) => {
      const pattern = pa.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(requestAction);
    });
  }

  private matchResource(
    policyResources: string[],
    requestResource: string
  ): boolean {
    return policyResources.some((pr) => {
      const pattern = pr.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(requestResource);
    });
  }

  // private resolveVariables(
  //   template: string,
  //   context: Record<string, string>
  // ): string {
  //   return template.replace(/\${(\w+)}/g, (_, key) => context[key] || '');
  // }
}
