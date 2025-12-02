import {
  LoginRequest,
  LoginResponse,
  AssumeRoleRequest,
  AssumeRoleResponse,
} from './authentication.schema';
import * as jwtService from '@/domains/realms/jwt/jwt.service';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as realmService from '@/domains/core/realms/realm.service';
import { UnauthorizedError } from '@/errors/unauthorized';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { JwtPayload } from '@/domains/realms/jwt/jwt.schema';

const SERVICE_NAME = 'authentication.service';

export const login = async (
  tenantId: string,
  args: LoginRequest
): Promise<LoginResponse> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.login`,
      attributes: {
        'tenant.id': tenantId,
        'account.email': args.email,
        operation: 'login',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, email: args.email }, 'Login attempt initiated');

      try {
        const account = await accountService.findByEmail(tenantId, args.email);
        span.setAttributes({ 'account.id': account._id });

        logger.debug(
          { tenantId, accountId: account._id },
          'Account found for login'
        );

        if (!(await accountService.comparePassword(account, args.password))) {
          logger.warn(
            { tenantId, email: args.email, accountId: account._id },
            'Failed login attempt - invalid password'
          );
          span.setAttributes({
            'auth.success': false,
            'auth.failure_reason': 'invalid_password',
          });
          throw new UnauthorizedError('Invalid email or password');
        }

        logger.info(
          { tenantId, accountId: account._id, email: args.email },
          'Successful login completed'
        );

        const token = await jwtService.generateToken(tenantId, {
          accountId: account._id,
        });
        const refreshToken = await jwtService.generateRefreshToken(tenantId, {
          accountId: account._id,
        });

        logger.debug(
          { tenantId, accountId: account._id },
          'JWT token and refresh token generated successfully'
        );

        span.setAttributes({ 'auth.success': true });

        return {
          token,
          refreshToken,
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
          span.setAttributes({
            'auth.success': false,
            'auth.failure_reason': 'account_not_found',
          });
          throw new UnauthorizedError('Invalid email or password');
        }
        logger.error(
          {
            tenantId,
            email: args.email,
            error: error,
          },
          'Login process failed with unexpected error'
        );
        span.setAttributes({
          'auth.success': false,
          'auth.failure_reason': 'unexpected_error',
        });
        throw error;
      }
    }
  );
};

export const assumeRole = async (
  sourceRealmId: string,
  sourceAccountId: string,
  data: AssumeRoleRequest
): Promise<AssumeRoleResponse> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.assumeRole`,
      attributes: {
        'tenant.id': sourceRealmId,
        'account.id': sourceAccountId,
        'target.realm.id': data.targetRealmId,
        'assumed.role.id': data.assumedRoleId,
        operation: 'assumeRole',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info(
        {
          sourceRealmId,
          sourceAccountId,
          targetRealmId: data.targetRealmId,
          assumedRoleId: data.assumedRoleId,
        },
        'Assuming role in target realm'
      );

      // Validate target realm exists
      const targetRealm = await realmService.findByPublicUUID(
        data.targetRealmId
      );
      span.setAttributes({ 'target.realm.internal.id': targetRealm._id });

      // Validate role exists in target realm
      await roleService.findById(data.targetRealmId, data.assumedRoleId);

      // TODO: Validate permissions (MVP: allow all)
      // Future: Check if sourceAccount has policy to assume this role

      // Generate JWT for target realm with cross-realm context
      const payload: JwtPayload = {
        accountId: sourceAccountId,
        sourceRealmId,
        targetRealmId: data.targetRealmId,
        assumedRoleId: data.assumedRoleId,
      };

      const token = await jwtService.generateToken(data.targetRealmId, payload);

      // Get expiration from target realm config
      const expiresIn = parseExpiresIn(targetRealm.jwtConfig.expiresIn);

      logger.info(
        {
          sourceRealmId,
          sourceAccountId,
          targetRealmId: data.targetRealmId,
          assumedRoleId: data.assumedRoleId,
        },
        'Role assumed successfully'
      );

      return { token, expiresIn };
    }
  );
};

export const refresh = async (
  tenantId: string,
  refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.refresh`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'refresh',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId }, 'Refresh token attempt initiated');

      try {
        const decoded = (await jwtService.verifyToken(
          tenantId,
          refreshToken
        )) as JwtPayload;
        span.setAttributes({ 'account.id': decoded.accountId });

        logger.debug(
          { tenantId, accountId: decoded.accountId },
          'Refresh token verified successfully'
        );

        const newToken = await jwtService.generateToken(tenantId, {
          accountId: decoded.accountId,
        });
        const newRefreshToken = await jwtService.generateRefreshToken(tenantId, {
          accountId: decoded.accountId,
        });

        logger.info(
          { tenantId, accountId: decoded.accountId },
          'New tokens generated successfully'
        );

        span.setAttributes({ 'auth.success': true });

        return { token: newToken, refreshToken: newRefreshToken };
      } catch (error) {
        logger.warn({ tenantId, error }, 'Invalid refresh token');
        span.setAttributes({ 'auth.success': false });
        throw new UnauthorizedError('Invalid refresh token');
      }
    }
  );
};

const parseExpiresIn = (expiresIn: string): number => {
  // Parse strings like "24h", "7d", "1h" to seconds
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 3600; // Default 1 hour

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * (multipliers[unit] || 3600);
};
