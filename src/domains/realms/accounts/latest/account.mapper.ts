import {
  AccountCreateResponse,
  AccountUpdateResponse,
  AccountListItemResponse,
} from './account.schema';
import { AccountDocument } from './account.model';

const getPrimaryEmail = (account: AccountDocument) => {
  const primaryEmail = account.emails.find(e => e.isPrimary);
  return primaryEmail || account.emails[0] || { email: '', isPrimary: false };
};

export const toCreateResponse = (
  account: AccountDocument
): AccountCreateResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};

export const toUpdateResponse = (
  account: AccountDocument
): AccountUpdateResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};

export const toListItemResponse = (
  account: AccountDocument
): AccountListItemResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};
