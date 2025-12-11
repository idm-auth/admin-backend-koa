import { DtoTypes } from '@/common/dto.types';
import { IService } from '@/abstract/AbstractService';
import { Context } from 'koa';
import { Schema } from 'mongoose';

export abstract class AbstractController<TSchema extends Schema, T extends DtoTypes> {
  protected abstract service: IService<TSchema, T>;
  protected abstract getResourceType(): string;

  // @Post('/')
  // @Authorize({ operation: 'CREATE', resource: this.getResourceType() })
  // @ValidateRequest({ params: tenantIdSchema, body: createSchema })
  // @ValidateResponse({ 201: responseSchema })
  // @SwaggerDoc({ summary: 'Create resource', tags: ['Resource'] })
  async create(ctx: Context): Promise<void> {
    const { tenantId } = ctx.params as { tenantId: string };
    const dto = ctx.request.body as T['CreateRequestDto'];
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
    const { tenantId } = ctx.params as { tenantId: string };
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
    const { tenantId, id } = ctx.params as { tenantId: string; id: string };
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
    const { tenantId, id } = ctx.params as { tenantId: string; id: string };
    const data = ctx.request.body as T['UpdateRequestDto'];
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
    const { tenantId, id } = ctx.params as { tenantId: string; id: string };
    const result = await this.service.delete(tenantId, id);
    if (!result) {
      ctx.status = 404;
      ctx.body = { error: 'Resource not found' };
      return;
    }
    ctx.status = 204;
  }
}
