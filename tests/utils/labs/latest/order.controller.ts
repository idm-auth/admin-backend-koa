// Controller latest que importa service v1 (cenário inverso)
import * as orderService from '../v1/order.service';

export interface RequestContext {
  tenantId: string;
  body: any;
}

export const create = async (ctx: RequestContext) => {
  console.log('LATEST CONTROLLER: Creating order (but using V1 service)');
  
  try {
    const order = await orderService.create(ctx.tenantId, ctx.body);
    return { status: 201, body: order };
  } catch (error) {
    console.error('LATEST CONTROLLER: Error creating order', error);
    throw error;
  }
};

export const findById = async (ctx: RequestContext & { id: string }) => {
  console.log('LATEST CONTROLLER: Finding order by ID (but using V1 service)');
  
  try {
    const order = await orderService.findById(ctx.tenantId, ctx.id);
    return { status: 200, body: order };
  } catch (error) {
    console.error('LATEST CONTROLLER: Error finding order', error);
    throw error;
  }
};