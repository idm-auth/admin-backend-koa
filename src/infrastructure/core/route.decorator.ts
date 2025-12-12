const ROUTE_METADATA_KEY = Symbol.for('route:metadata');

export interface RouteMetadata {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  methodName: string;
}

function createRouteDecorator(method: RouteMetadata['method']) {
  return (path: string): MethodDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      const routes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
      routes.push({
        method,
        path,
        methodName: propertyKey as string,
      });
      Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
    };
  };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Delete = createRouteDecorator('DELETE');
export const Patch = createRouteDecorator('PATCH');

export function getRouteMetadata(target: any): RouteMetadata[] {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}
