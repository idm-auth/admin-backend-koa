import { getContainer } from '@/infrastructure/core/container.instance';
import { injectable } from 'inversify';

const CONTROLLER_METADATA_KEY = Symbol.for('controller:basePath');

export interface ControllerMetadata {
  basePath: string;
}

export function Controller(basePath: string): ClassDecorator {
  return (target: any) => {
    injectable()(target);
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { basePath }, target);

    const container = getContainer();
    const symbol = Symbol.for(target.name);
    container.bind(symbol).to(target).inSingletonScope();

    return target;
  };
}

export function getControllerMetadata(
  target: any
): ControllerMetadata | undefined {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}

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
export const Mapper = createStereotype;
export const Configuration = createStereotype;
