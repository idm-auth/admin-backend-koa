import { LoginRequest } from './authentication.schema';
import { LoginResponse } from './authentication.schema';
import * as jwtService from '@/domains/realms/jwt/latest/jwt.service';
import * as accountService from '@/domains/realms/accounts/latest/account.service';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  const logger = await getLogger();

  logger.debug({
    email: args.email,
  });

  const account = await accountService.findByEmail(tenantId, {
    email: args.email,
  });

  if (
    !account ||
    !(await accountService.comparePassword(account, args.password))
  ) {
    throw new Error('Invalid credentials');
  }

  const token = await jwtService.generateToken(tenantId, {
    accountId: account._id,
    email: args.email,
  });

  return {
    token,
    account: {
      _id: account._id.toString(),
      emails: account.emails,
    },
  };
};
