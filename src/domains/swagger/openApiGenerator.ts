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
  //   console.log(JSON.stringify(registry.definitions));

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Swagger POC API',
      version: '1.0.0',
      description: 'API documentation generated from Zod schemas',
    },
  });
};
