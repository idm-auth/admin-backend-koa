// Controller latest - usa service relativo
import * as productService from './product.service';

export interface RequestContext {
  tenantId: string;
  body: any;
}

export const create = async (ctx: RequestContext) => {
  console.log('LATEST CONTROLLER: Creating product');
  
  try {
    const product = await productService.create(ctx.tenantId, ctx.body);
    return { status: 201, body: product };
  } catch (error) {
    console.error('LATEST CONTROLLER: Error creating product', error);
    throw error;
  }
};

export const findById = async (ctx: RequestContext & { id: string }) => {
  console.log('LATEST CONTROLLER: Finding product by ID');
  
  try {
    const product = await productService.findById(ctx.tenantId, ctx.id);
    return { status: 200, body: product };
  } catch (error) {
    console.error('LATEST CONTROLLER: Error finding product', error);
    throw error;
  }
};