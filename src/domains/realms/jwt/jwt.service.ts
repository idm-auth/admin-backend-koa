import {
  JwtPayload,
  jwtPayloadSchema,
} from './jwt.schema';
import { PublicUUID } from '@/domains/commons/base/base.schema';
import * as realmService from '@/domains/core/realms/realm.service';
import { validateZod } from '@/domains/commons/validations/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import jwt, { PrivateKey, Secret, SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';

export const generateToken = async (
  tenantId: PublicUUID,
  payload: JwtPayload
): Promise<string> => {
  const logger = await getLogger();
  logger.debug({ tenantId });

  // Validações
  await validateZod(payload, jwtPayloadSchema);

  const realm = await realmService.findByPublicUUID(tenantId);

  const payloadSign: string | Buffer | object = payload;
  const secretOrPrivateKeySign: Secret | PrivateKey = realm.jwtConfig.secret;
  const optionsSign: SignOptions = {
    expiresIn: realm.jwtConfig.expiresIn as StringValue,
  };

  return jwt.sign(payloadSign, secretOrPrivateKeySign, optionsSign);
};

export const verifyToken = async (tenantId: PublicUUID, token: string) => {
  const realm = await realmService.findByPublicUUID(tenantId);
  return jwt.verify(token, realm.jwtConfig.secret);
};