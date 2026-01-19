import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export const POLICY_EFFECTS = ['Allow', 'Deny'] as const;
export type PolicyEffect = (typeof POLICY_EFFECTS)[number];

export type PolicyAction = {
  system: string;
  resource: string;
  operation: string;
};

export type PolicyResource = {
  partition: string;
  system: string;
  region: string;
  tenantId: string;
  resourcePath: string;
};

export type Policy = {
  version: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  actions: PolicyAction[];
  resources: PolicyResource[];
};

export const policySchema = new mongoose.Schema<Policy>(
  {
    version: {
      type: String,
      required: true,
      default: '2025-12-24',
      validate: {
        validator: (v: string) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
          const date = new Date(v);
          return date instanceof Date && !isNaN(date.getTime()) && v === date.toISOString().split('T')[0];
        },
        message: 'Version must be valid ISO date format (YYYY-MM-DD)',
      },
    },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    effect: { type: String, required: true, enum: POLICY_EFFECTS },
    actions: [
      {
        system: { type: String, required: true },
        resource: { type: String, required: true },
        operation: { type: String, required: true },
      },
    ],
    resources: [
      {
        partition: { type: String, required: true },
        system: { type: String, required: true },
        region: { type: String, required: true },
        tenantId: { type: String, required: true },
        resourcePath: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
policySchema.add(baseEntitySchema);

export type PolicySchema = typeof policySchema;
export type PolicyEntity = HydratedDocument<InferSchemaType<typeof policySchema>>;

export type PolicyCreate = InferSchemaType<typeof policySchema>;

/**
 * Exemplos de Policy JSON:
 *
 * 1. Admin Completo (Todas as Aplicações)
 * {
 *   "version": "2025-12-24",
 *   "name": "AdminFullAccess",
 *   "description": "Acesso total a todas as aplicações do tenant",
 *   "effect": "Allow",
 *   "actions": [{ "system": "*", "resource": "*", "operation": "*" }],
 *   "resources": [{ "partition": "global", "system": "*", "region": "", "tenantId": "${tenantId}", "resourcePath": "*" }]
 * }
 *
 * 2. Gerenciador de Usuários (IAM)
 * {
 *   "version": "2025-12-24",
 *   "name": "IAMUserManager",
 *   "description": "Gerenciar contas de usuário no IAM",
 *   "effect": "Allow",
 *   "actions": [
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "create" },
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "read" },
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "update" },
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "list" }
 *   ],
 *   "resources": [{ "partition": "global", "system": "idm-auth-core-api", "region": "", "tenantId": "${tenantId}", "resourcePath": "accounts/*" }]
 * }
 *
 * 3. Somente Leitura (Todas as Apps)
 * {
 *   "version": "2025-12-24",
 *   "name": "ReadOnlyAccess",
 *   "description": "Acesso somente leitura em todas as aplicações",
 *   "effect": "Allow",
 *   "actions": [
 *     { "system": "*", "resource": "*", "operation": "read" },
 *     { "system": "*", "resource": "*", "operation": "list" }
 *   ],
 *   "resources": [{ "partition": "global", "system": "*", "region": "", "tenantId": "${tenantId}", "resourcePath": "*" }]
 * }
 *
 * 4. Negar Deleção (Todas as Apps)
 * {
 *   "version": "2025-12-24",
 *   "name": "DenyDelete",
 *   "description": "Impede deleção de qualquer recurso",
 *   "effect": "Deny",
 *   "actions": [{ "system": "*", "resource": "*", "operation": "delete" }],
 *   "resources": [{ "partition": "global", "system": "*", "region": "", "tenantId": "${tenantId}", "resourcePath": "*" }]
 * }
 *
 * 5. Self-Service (Própria Conta)
 * {
 *   "version": "2025-12-24",
 *   "name": "SelfManagement",
 *   "description": "Usuário pode gerenciar própria conta no IAM",
 *   "effect": "Allow",
 *   "actions": [
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "read" },
 *     { "system": "idm-auth-core-api", "resource": "accounts", "operation": "update" }
 *   ],
 *   "resources": [{ "partition": "global", "system": "idm-auth-core-api", "region": "", "tenantId": "${tenantId}", "resourcePath": "accounts/${accountId}" }]
 * }
 *
 * 6. Vendedor (CRM + Billing Read)
 * {
 *   "version": "2025-12-24",
 *   "name": "SalesRepresentative",
 *   "description": "Vendedor pode gerenciar clientes e ver faturas",
 *   "effect": "Allow",
 *   "actions": [
 *     { "system": "app-crm", "resource": "customers", "operation": "*" },
 *     { "system": "app-crm", "resource": "opportunities", "operation": "*" },
 *     { "system": "app-billing", "resource": "invoices", "operation": "read" },
 *     { "system": "app-billing", "resource": "invoices", "operation": "list" }
 *   ],
 *   "resources": [{ "partition": "global", "system": "*", "region": "", "tenantId": "${tenantId}", "resourcePath": "*" }]
 * }
 */
