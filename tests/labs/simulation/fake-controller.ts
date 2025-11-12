// Simulação exata do account.controller.ts
import * as fakeService from './fake-service';

export const create = async (ctx: {
  tenantId: string;
  data: { email: string };
}) => {
  try {
    const account = await fakeService.create(ctx.tenantId, ctx.data);
    return { status: 201, body: account };
  } catch (error) {
    // Linha equivalente à linha 28 do controller real
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Controller error: ${errorMessage}`);
  }
};

export const findById = async (ctx: { tenantId: string; id: string }) => {
  try {
    const account = await fakeService.findById(ctx.tenantId, ctx.id);
    return { status: 200, body: account };
  } catch (error) {
    throw error;
  }
};
