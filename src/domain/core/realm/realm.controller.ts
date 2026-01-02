import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  Get,
  Post,
  Put,
  Delete,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import { commonErrorResponses, ContextWithBody, ContextWithParams, ContextWithParamsAndBody, IdParam } from 'koa-inversify-framework/common';
import { RequestParamsIdSchema } from 'koa-inversify-framework/common';
import {
  RealmService,
  RealmServiceSymbol,
} from '@/domain/core/realm/realm.service';
import {
  RealmMapper,
  RealmMapperSymbol,
} from '@/domain/core/realm/realm.mapper';
import {
  RealmDtoTypes,
  realmCreateSchema,
  realmUpdateSchema,
  realmFullResponseSchema,
} from '@/domain/core/realm/realm.dto';
import { RealmSchema, RealmCreate } from '@/domain/core/realm/realm.entity';

export const RealmControllerSymbol = Symbol.for('RealmController');

@SwaggerDocController({
  name: 'Realm',
  description: 'Realm management',
  tags: ['Realm'],
})
@Controller(RealmControllerSymbol, { basePath: '/api/core/realm' })
export class RealmController extends AbstractCrudController<
  RealmSchema,
  RealmDtoTypes,
  RealmCreate
> {
  constructor(
    @inject(RealmServiceSymbol) protected service: RealmService,
    @inject(RealmMapperSymbol) protected mapper: RealmMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'core.realm';
  }

  @SwaggerDoc({
    summary: 'Create realm',
    description: 'Creates a new realm',
    tags: ['Realm'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: realmCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Realm created successfully',
        content: {
          'application/json': {
            schema: realmFullResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      409: commonErrorResponses[409],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ body: realmCreateSchema })
  @Post('/')
  async create(ctx: ContextWithBody<RealmDtoTypes['CreateRequestDto']>): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List realms',
    description: 'Returns paginated list of realms',
    tags: ['Realm'],
    responses: {
      200: {
        description: 'Paginated list of realms',
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @Get('/')
  async findAllPaginated(ctx: Context): Promise<void> {
    return super.findAllPaginated(ctx);
  }

  @SwaggerDoc({
    summary: 'Get realm by ID',
    description: 'Returns a single realm',
    tags: ['Realm'],
    request: {
      params: RequestParamsIdSchema,
    },
    responses: {
      200: {
        description: 'Realm found',
        content: {
          'application/json': {
            schema: realmFullResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdSchema })
  @Get('/:id')
  async findById(ctx: ContextWithParams<IdParam>): Promise<void> {
    return super.findById(ctx);
  }

  @SwaggerDoc({
    summary: 'Update realm',
    description: 'Updates an existing realm',
    tags: ['Realm'],
    request: {
      params: RequestParamsIdSchema,
      body: {
        content: {
          'application/json': {
            schema: realmUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Realm updated successfully',
        content: {
          'application/json': {
            schema: realmFullResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      409: commonErrorResponses[409],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdSchema,
    body: realmUpdateSchema,
  })
  @Put('/:id')
  async update(ctx: ContextWithParamsAndBody<IdParam, RealmDtoTypes['UpdateRequestDto']>): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete realm',
    description: 'Deletes a realm',
    tags: ['Realm'],
    request: {
      params: RequestParamsIdSchema,
    },
    responses: {
      200: {
        description: 'Realm deleted successfully',
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdSchema })
  @Delete('/:id')
  async delete(ctx: ContextWithParams<IdParam>): Promise<void> {
    return super.delete(ctx);
  }
}
