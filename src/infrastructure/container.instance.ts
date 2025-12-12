import { Container } from 'inversify';

const container = new Container();

export const getContainer = (): Container => {
  console.log('getContainer');
  if (!container) throw new Error('Container not initialized');
  return container;
};
