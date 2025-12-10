import { authenticate, authorize } from '@idm-auth/client';
import { AxiosHttpClient } from '@/utils/http/AxiosHttpClient';
import { getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';

const httpClient = new AxiosHttpClient(10000);

export const validateToken = async (
  tenantId: string,
  token: string,
  application: string
) => {
  const idmUrl = getEnvValue(EnvKey.IDM_API_URL);

  return authenticate(httpClient, idmUrl, {
    tenantId,
    token,
    application,
  });
};

export const checkAuthorization = async (
  tenantId: string,
  accountId: string,
  action: string,
  resource: string,
  application: string
) => {
  const idmUrl = getEnvValue(EnvKey.IDM_API_URL);

  return authorize(httpClient, idmUrl, {
    tenantId,
    accountId,
    action,
    resource,
    application,
  });
};
