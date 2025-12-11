import { Context } from 'koa';
import { injectable } from 'inversify';

/**
 * AbstractController with MagicRouter decorators
 *
 * Decorators are commented out and will be implemented progressively
 */

// @Controller('/resource')
// @Auth({ someOneMethod: true })
@injectable()
export abstract class AbstractController<TService, TCreateDto, TDto> {
  protected abstract service: TService;
  protected abstract getResourceType(): string;

  // @Post('/')
  // @Authorize({ operation: 'CREATE', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdSchema, body: createSchema })
  // @ValidateResponse({ 201: responseSchema })
  // @SwaggerDoc({ summary: 'Create resource', tags: ['Resource'] })
  async create(ctx: Context): Promise<void> {
    const { tenantId } = ctx.params;
    const dto = ctx.request.body;
    const result = await this.service.create(tenantId, dto);
    ctx.status = 201;
    ctx.body = result;
  }

  // @Get('/')
  // @Authorize({ operation: 'LIST', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdSchema, query: paginationSchema })
  // @ValidateResponse({ 200: paginatedResponseSchema })
  // @SwaggerDoc({ summary: 'List resources', tags: ['Resource'] })
  async findAllPaginated(ctx: Context): Promise<void> {
    const { tenantId } = ctx.params;
    const query = ctx.query;
    const result = await this.service.findAllPaginated(tenantId, query);
    ctx.body = result;
  }

  // @Get('/:id')
  // @Authorize({ operation: 'READ', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdAndIdSchema })
  // @ValidateResponse({ 200: responseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Get resource by ID', tags: ['Resource'] })
  async findById(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const result = await this.service.findById(tenantId, id);
    if (!result) {
      ctx.status = 404;
      ctx.body = { error: 'Resource not found' };
      return;
    }
    ctx.body = result;
  }

  // @Put('/:id')
  // @Authorize({ operation: 'UPDATE', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: updateSchema })
  // @ValidateResponse({ 200: responseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Update resource', tags: ['Resource'] })
  async update(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const data = ctx.request.body;
    const result = await this.service.update(tenantId, id, data);
    if (!result) {
      ctx.status = 404;
      ctx.body = { error: 'Resource not found' };
      return;
    }
    ctx.body = result;
  }

  // @Delete('/:id')
  // @Authorize({ operation: 'DELETE', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdAndIdSchema })
  // @ValidateResponse({ 204: undefined, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Delete resource', tags: ['Resource'] })
  async delete(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const result = await this.service.delete(tenantId, id);
    if (!result) {
      ctx.status = 404;
      ctx.body = { error: 'Resource not found' };
      return;
    }
    ctx.status = 204;
  }
}
