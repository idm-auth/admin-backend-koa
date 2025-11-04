import { LoginRequest } from './authentication.schema';
import { LoginResponse } from './authentication.schema';
import * as jwtService from '@/domains/realms/jwt/latest/jwt.service';
import * as accountService from '@/domains/realms/accounts/latest/account.service';
import { UnauthorizedError } from '@/errors/unauthorized';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  const logger = await getLogger();

  logger.info({ tenantId, email: args.email }, 'Login attempt initiated');

  try {
    const account = await accountService.findByEmail(tenantId, args.email);
    logger.debug(
      { tenantId, accountId: account._id },
      'Account found for login'
    );

    if (!(await accountService.comparePassword(account, args.password))) {
      logger.warn(
        { tenantId, email: args.email, accountId: account._id },
        'Failed login attempt - invalid password'
      );
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info(
      { tenantId, accountId: account._id, email: args.email },
      'Successful login completed'
    );

    const token = await jwtService.generateToken(tenantId, {
      accountId: account._id,
      email: args.email,
    });

    logger.debug(
      { tenantId, accountId: account._id },
      'JWT token generated successfully'
    );

    return {
      token,
      account: {
        _id: account._id.toString(),
        emails: account.emails,
      },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      logger.warn(
        { tenantId, email: args.email },
        'Failed login attempt - account not found'
      );
      throw new UnauthorizedError('Invalid email or password');
    }
    logger.error(
      {
        tenantId,
        email: args.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Login process failed with unexpected error'
    );
    throw error;
  }
};
