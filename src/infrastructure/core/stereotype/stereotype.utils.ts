import { getContainer } from '@/infrastructure/core/container.instance';
import { injectable } from 'inversify';

export function createStereotype(symbol: symbol) {
  return function <T extends new (...args: never[]) => object>(target: T) {
    registerInContainer(target, symbol);
    return target;
  };
}

export function registerInContainer(
  target: new (...args: never[]) => object,
  symbol: symbol
): void {
  injectable()(target);
  const container = getContainer();
  container.bind(symbol).to(target).inSingletonScope();
}
