import { JwtPayload, JwtPayloadSign, jwtPayloadSchema } from './jwt.schema';
import { PublicUUID } from '@/domains/commons/base/base.schema';
import * as realmService from '@/domains/core/realms/realm.service';
import { validateZod } from '@/domains/commons/validations/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import jwt, { PrivateKey, Secret, SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'jwt.service';

export const generateToken = async (
  tenantId: PublicUUID,
  payload: JwtPayload
): Promise<string> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.generateToken`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': payload.accountId,
        operation: 'generateToken',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ tenantId });

      // Validações
      await validateZod(payload, jwtPayloadSchema);

      const realm = await realmService.findByPublicUUID(tenantId);
      span.setAttributes({ 'realm.id': realm._id });

      const payloadSign: JwtPayloadSign = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
      };
      const secretOrPrivateKeySign: Secret | PrivateKey =
        realm.jwtConfig.secret;
      const optionsSign: SignOptions = {
        expiresIn: realm.jwtConfig.expiresIn as StringValue,
      };

      span.setAttributes({ 'jwt.expiresIn': realm.jwtConfig.expiresIn });

      const token = jwt.sign(payloadSign, secretOrPrivateKeySign, optionsSign);
      span.setAttributes({ 'jwt.generated': true });

      return token;
    }
  );
};

export const verifyToken = async (tenantId: PublicUUID, token: string) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.verifyToken`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'verifyToken',
      },
    },
    async (span) => {
      const realm = await realmService.findByPublicUUID(tenantId);
      span.setAttributes({ 'realm.id': realm._id });

      try {
        const decoded = jwt.verify(token, realm.jwtConfig.secret);
        span.setAttributes({ 'jwt.valid': true });
        return decoded;
      } catch (error) {
        span.setAttributes({ 'jwt.valid': false });
        throw error;
      }
    }
  );
};

export const generateRefreshToken = async (
  tenantId: PublicUUID,
  payload: JwtPayload
): Promise<string> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.generateRefreshToken`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': payload.accountId,
        operation: 'generateRefreshToken',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ tenantId });

      await validateZod(payload, jwtPayloadSchema);

      const realm = await realmService.findByPublicUUID(tenantId);
      span.setAttributes({ 'realm.id': realm._id });

      const payloadSign: JwtPayloadSign = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
      };
      const secretOrPrivateKeySign: Secret | PrivateKey =
        realm.jwtConfig.secret;
      const optionsSign: SignOptions = {
        expiresIn: '7d',
      };

      span.setAttributes({ 'jwt.expiresIn': '7d' });

      const token = jwt.sign(payloadSign, secretOrPrivateKeySign, optionsSign);
      span.setAttributes({ 'jwt.generated': true });

      return token;
    }
  );
};
