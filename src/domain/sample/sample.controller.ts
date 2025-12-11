import { injectable, inject } from 'inversify';
import {
  SampleService,
  SampleServiceSymbol,
} from '@/domain/sample/sample.service';
import { CreateSampleDto, SampleDto } from '@/domain/sample/sample.dto';
import { AbstractController } from '@/abstract/AbstractController';

export const SampleControllerSymbol = Symbol.for('SampleController');

@injectable()
export class SampleController extends AbstractController<
  SampleService,
  CreateSampleDto,
  SampleDto
> {
  constructor(@inject(SampleServiceSymbol) protected service: SampleService) {
    super();
  }

  protected getControllerName(): string {
    return 'sample';
  }

  protected getRoutePrefix(): string {
    return '/samples';
  }
}
