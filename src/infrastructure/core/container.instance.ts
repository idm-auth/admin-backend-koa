import { Container } from 'inversify';

export const container = new Container();

export const getContainer = (): Container => container;
