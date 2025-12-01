import { withSpan } from '@/utils/tracing.util';
import { AssumeRoleResponse } from './authentication.schema';

const MAPPER_NAME = 'authentication.mapper';

export const toAssumeRoleResponse = (
  token: string,
  expiresIn: number
): AssumeRoleResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toAssumeRoleResponse`,
      attributes: { operation: 'toAssumeRoleResponse' },
    },
    () => ({
      token,
      expiresIn,
    })
  );
