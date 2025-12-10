import { Context } from 'koa';
import {
  TraceAsync,
  getCurrentSpan,
} from '@/infrastructure/telemetry/trace.decorator';

export abstract class AbstractController<TService, TCreateDto, TDto> {
  protected abstract service: TService & {
    create(dto: TCreateDto): Promise<TDto>;
    findAll(): Promise<TDto[]>;
  };

  protected abstract getControllerName(): string;

  @TraceAsync()
  async create(ctx: Context): Promise<void> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getControllerName()}.controller.create`);
      span.setAttributes({ 'http.method': 'POST' });
    }

    const dto = ctx.request.body;
    const result = await this.service.create(dto);
    ctx.status = 201;
    ctx.body = result;
  }

  @TraceAsync()
  async findAll(ctx: Context): Promise<void> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getControllerName()}.controller.findAll`);
      span.setAttributes({ 'http.method': 'GET' });
    }

    const result = await this.service.findAll();
    ctx.body = result;
  }
}
