import { withSpan } from '@/utils/tracing.util';
import { Account } from './account.model';
import {
  AccountCreateResponse,
  AccountListItemResponse,
  AccountUpdateResponse,
} from './account.schema';

const MAPPER_NAME = 'account';

export const toCreateResponse = (account: Account): AccountCreateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toCreateResponse`,
      attributes: { 'account.id': account._id.toString() },
    },
    () => ({
      _id: account._id.toString(),
      emails: account.emails,
    })
  );
};

export const toUpdateResponse = (account: Account): AccountUpdateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toUpdateResponse`,
      attributes: { 'account.id': account._id.toString() },
    },
    () => ({
      _id: account._id.toString(),
      emails: account.emails,
    })
  );
};

export const toListItemResponse = (
  account: Account
): AccountListItemResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toListItemResponse`,
      attributes: { 'account.id': account._id.toString() },
    },
    () => ({
      _id: account._id.toString(),
      emails: account.emails,
    })
  );
};
