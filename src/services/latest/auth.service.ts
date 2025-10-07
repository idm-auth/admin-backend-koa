import { LoginRequest } from '@/schemas/auth/v1/login/request';
import { LoginResponse } from '@/schemas/auth/v1/login/response';
import * as jwtService from '@/services/latest/jwt.service';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  const logger = await getLogger();

  logger.debug({
    email: args.email,
  });

  const account = await accountService.findByEmail(tenantId, { email: args.email });

  if (!account || !(await accountService.comparePassword(account, args.password))) {
    throw new Error('Invalid credentials');
  }

  const token = await jwtService.generateToken(tenantId, {
    accountId: account._id,
    email: args.email,
  });

  return {
    token,
    account: {
      id: account._id,
      emails: account.emails,
    },
  };
};
