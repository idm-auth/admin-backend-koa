import { LoginRequest } from '@/schemas/auth/v1/login/request';
import { LoginResponse } from '@/schemas/auth/v1/login/response';
import { getLogger } from '@/utils/localStorage.util';
import * as userService from '@/services/v1/user.service';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  const logger = await getLogger();

  logger.debug({
    email: args.email,
  });

  const user = await userService.findByEmail(tenantId, { email: args.email });

  if (!user || user.password !== args.password) {
    throw new Error('Invalid credentials');
  }

  // TODO: Implementar geração de token JWT

  return {
    token: 'mock-jwt-token',
    user: {
      id: user.id,
      emails: user.emails,
    },
  };
};
