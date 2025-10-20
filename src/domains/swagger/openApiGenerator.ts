import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

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
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  });
};
