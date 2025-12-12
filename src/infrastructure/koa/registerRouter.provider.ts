import { Configuration } from '@/infrastructure/core/stereotype/configuration.stereotype';
import { getControllerMetadata, getAllControllers } from '@/infrastructure/core/stereotype/controller.stereotype';
import { getRouteMetadata } from '@/infrastructure/core/route.decorator';
import { container } from '@/infrastructure/core/container.instance';
import Koa from 'koa';
import Router from '@koa/router';

export const RegisterRouterSymbol = Symbol.for('RegisterRouter');

@Configuration(RegisterRouterSymbol)
export class RegisterRouter {
  async setup(app: Koa, router: Router): Promise<void> {
    const controllers = await getAllControllers();
    controllers.forEach((symbol) => this.registerController(symbol, router));
  }

  private registerController(controllerSymbol: symbol, router: Router): void {
    const controller = container.get(controllerSymbol);
    const controllerClass = controller.constructor;

    const controllerMetadata = getControllerMetadata(controllerClass);
    if (!controllerMetadata) return;

    const routes = getRouteMetadata(controllerClass);

    routes.forEach((route) => {
      const fullPath = controllerMetadata.basePath + route.path;
      const handler = (controller as any)[route.methodName].bind(controller);

      switch (route.method) {
        case 'GET':
          router.get(fullPath, handler);
          break;
        case 'POST':
          router.post(fullPath, handler);
          break;
        case 'PUT':
          router.put(fullPath, handler);
          break;
        case 'DELETE':
          router.delete(fullPath, handler);
          break;
        case 'PATCH':
          router.patch(fullPath, handler);
          break;
      }
    });
  }
}
