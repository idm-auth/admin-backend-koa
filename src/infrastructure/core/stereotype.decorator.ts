import { injectable } from 'inversify';
import { getContainer } from '@/infrastructure/core/container.instance';

function createStereotype(symbol: symbol) {
  return function <T extends new (...args: never[]) => object>(target: T) {
    injectable()(target);
    const container = getContainer();
    container.bind(symbol).to(target).inSingletonScope();
    return target;
  };
}

export const Repository = createStereotype;
export const Service = createStereotype;
export const Controller = createStereotype;
export const Mapper = createStereotype;
export const Configuration = createStereotype;
