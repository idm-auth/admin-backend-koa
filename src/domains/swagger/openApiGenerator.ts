import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export { registry };

export const getOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Multi-Tenant API',
      version: '1.0.0',
      description:
        'Multi-tenant API with role-based access control (RBAC) for managing accounts, groups, roles and policies',
      contact: {
        name: 'API Support',
        email: getEnvValue(EnvKey.API_SUPPORT_EMAIL),
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: getEnvValue(EnvKey.API_MAIN_URL),
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Accounts',
        description: 'User account management',
      },
      {
        name: 'Groups',
        description: 'Group management and organization',
      },
      {
        name: 'Roles',
        description: 'Role definition and management',
      },
      {
        name: 'Policies',
        description: 'Policy management and permissions',
      },
      {
        name: 'Account-Groups',
        description: 'Account and group associations',
      },
      {
        name: 'Group-Roles',
        description: 'Group and role associations',
      },
      {
        name: 'Account-Roles',
        description: 'Account and role associations',
      },
      {
        name: 'Realms',
        description: 'Tenant realm management',
      },
    ],
  });
};
