import { Container } from 'inversify';

const container = new Container();

export const getContainer = (): Container => {
  if (!container) throw new Error('Container not initialized');
  return container;
};
