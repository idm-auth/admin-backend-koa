export abstract class AbstractRepository<TEntity, TCreateDto> {
  abstract create(dto: TCreateDto): Promise<TEntity>;
  abstract findAll(): Promise<TEntity[]>;
}
