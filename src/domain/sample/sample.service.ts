import { injectable, inject } from 'inversify';
import {
  SampleRepository,
  SampleRepositorySymbol,
} from '@/domain/sample/sample.repository';
import {
  SampleMapper,
  SampleMapperSymbol,
} from '@/domain/sample/sample.mapper';
import { CreateSampleDto, SampleDto } from '@/domain/sample/sample.dto';
import { SampleEntity } from '@/domain/sample/sample.entity';
import { AbstractService } from '@/abstract/AbstractService';

export const SampleServiceSymbol = Symbol.for('SampleService');

@injectable()
export class SampleService extends AbstractService<
  SampleEntity,
  SampleDto,
  CreateSampleDto
> {
  constructor(
    @inject(SampleRepositorySymbol) protected repository: SampleRepository,
    @inject(SampleMapperSymbol) protected mapper: SampleMapper
  ) {
    super();
  }

  protected getServiceName(): string {
    return 'sample';
  }
}
