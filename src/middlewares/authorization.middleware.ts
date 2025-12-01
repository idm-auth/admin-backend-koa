import { Context, Next } from 'koa';

/**
 * Authorization Middleware - Policy-Based Access Control
 *
 * STUB: Este middleware está preparado mas não implementado.
 * Atualmente apenas passa a requisição adiante.
 *
 * Implementação futura deve:
 * 1. Verificar se ctx.state.user existe (populado pelo authentication middleware)
 * 2. Buscar policies do user (account-policies, group-policies, role-policies)
 * 3. Substituir variáveis no resource (${tenantId}, ${accountId}, ${id})
 * 4. Avaliar policies usando Policy Engine
 * 5. Aplicar regra: Deny > Allow > Deny implícito
 * 6. Lançar ForbiddenError se acesso negado
 */
export const authorizationMiddleware = () => {
  return async (ctx: Context, next: Next) => {
    // STUB: Implementação futura do Policy Engine
    // Atualmente apenas passa adiante

    // TODO: Implementar avaliação de policies
    // if (!ctx.state.user) {
    //   throw new UnauthorizedError('User not authenticated');
    // }

    // const policies = await getUserPolicies(ctx.state.user.accountId, ctx.state.user.tenantId);

    // const resource = replaceVariables(authzConfig.resource, {
    //   tenantId: ctx.state.user.tenantId,
    //   accountId: ctx.state.user.accountId,
    //   ...ctx.validated.params,
    // });

    // const allowed = evaluatePolicies(policies, {
    //   action: authzConfig.action,
    //   resource,
    // });

    // if (!allowed) {
    //   throw new ForbiddenError(
    //     `Access denied for action '${authzConfig.action}' on resource '${resource}'`
    //   );
    // }

    await next();
  };
};

// const replaceVariables = (
//   template: string | undefined,
//   variables: Record<string, string>
// ): string => {
//   if (!template) return '';
//   return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
// };

// const getUserPolicies = async (
//   accountId: string,
//   tenantId: string
// ): Promise<Policy[]> => {
//   // Buscar policies de:
//   // 1. account-policies (diretas)
//   // 2. group-policies (via account-groups)
//   // 3. role-policies (via account-roles e group-roles)
//   return [];
// };

// const evaluatePolicies = (
//   policies: Policy[],
//   context: { action: string; resource: string }
// ): boolean => {
//   // Regra: Deny explícito > Allow explícito > Deny implícito
//   // 1. Se alguma policy tem Deny que match → false
//   // 2. Se alguma policy tem Allow que match → true
//   // 3. Caso contrário → false (deny implícito)
//   return false;
// };
