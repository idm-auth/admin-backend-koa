import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

/**
 * Application Configuration Entity
 *
 * Centralized configuration management for applications (similar to Spring Cloud Config).
 * Stores environment-specific configurations that applications fetch at startup or runtime.
 *
 * Purpose:
 * - Provide external configuration for applications
 * - Support multiple environments (dev, staging, production, custom)
 * - Enable configuration changes without code deployment
 * - Multi-tenant: each realm has isolated configurations
 *
 * Usage Pattern:
 * 1. Application registers in Application entity
 * 2. Create configs for each environment (dev, staging, prod)
 * 3. Application fetches config at startup: GET /app/:name/env/:environment
 * 4. Config is flexible JSON structure (Record<string, any>)
 * 5. Optional JSON Schema for self-validation
 *
 * Example:
 * {
 *   name: "web-admin-uuid",
 *   environment: "production",
 *   config: {
 *     api: { main: { url: "https://api.prod.com" } },
 *     features: { analytics: true },
 *     limits: { maxUsers: 1000 }
 *   },
 *   schema: { ... } // Optional JSON Schema for validation
 * }
 */

export const applicationConfigurationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    environment: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
    schema: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
applicationConfigurationSchema.add(baseEntitySchema);
applicationConfigurationSchema.index(
  { name: 1, environment: 1 },
  { unique: true }
);

export type ApplicationConfigurationSchema =
  typeof applicationConfigurationSchema;
export type ApplicationConfigurationEntity = HydratedDocument<
  InferSchemaType<typeof applicationConfigurationSchema>
>;
