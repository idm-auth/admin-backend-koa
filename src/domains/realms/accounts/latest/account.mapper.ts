import {
  AccountCreateResponse,
  AccountUpdateResponse,
  AccountListItemResponse,
} from './account.schema';
import { AccountDocument } from './account.model';

export const toCreateResponse = (
  account: AccountDocument
): AccountCreateResponse => ({
  _id: account._id.toString(),
  email: account.emails[0]?.email || '',
});

export const toUpdateResponse = (
  account: AccountDocument
): AccountUpdateResponse => ({
  _id: account._id.toString(),
  email: account.emails[0]?.email || '',
});

export const toListItemResponse = (
  account: AccountDocument
): AccountListItemResponse => ({
  _id: account._id.toString(),
  email: account.emails[0]?.email || '',
});
