import { LoginRequest } from '@/schemas/auth/v1/login/request';
import { LoginResponse } from '@/schemas/auth/v1/login/response';
import * as jwtService from '@/services/latest/jwt.service';
import * as userService from '@/services/v1/user.service';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  const logger = await getLogger();

  logger.debug({
    email: args.email,
  });

  const user = await userService.findByEmail(tenantId, { email: args.email });

  if (!user || !(await userService.comparePassword(user, args.password))) {
    throw new Error('Invalid credentials');
  }

  const token = await jwtService.generateToken(tenantId, {
    userId: user._id,
    email: args.email,
  });

  return {
    token,
    user: {
      id: user._id,
      emails: user.emails,
    },
  };
};
