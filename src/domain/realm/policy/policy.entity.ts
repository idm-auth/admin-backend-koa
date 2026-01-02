import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export const POLICY_EFFECTS = ['Allow', 'Deny'] as const;
export type PolicyEffect = (typeof POLICY_EFFECTS)[number];

export type Policy = {
  version: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  actions: string[];
  resources: string[];
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
    actions: [{ type: String, required: true }],
    resources: [{ type: String, required: true }],
  },
  { timestamps: true }
);
policySchema.add(baseEntitySchema);

export type PolicySchema = typeof policySchema;
export type PolicyEntity = HydratedDocument<InferSchemaType<typeof policySchema>>;

export type PolicyCreate = InferSchemaType<typeof policySchema>;
