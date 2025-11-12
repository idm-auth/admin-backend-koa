import { Account } from './account.model';
import {
  AccountCreateResponse,
  AccountListItemResponse,
  AccountUpdateResponse,
} from './account.schema';

const getPrimaryEmail = (account: Account) => {
  if (!account.emails || account.emails.length === 0) {
    throw new Error('Account must have at least one email');
  }
  const primaryEmail = account.emails.find((e) => e.isPrimary);
  const selectedEmail = primaryEmail || account.emails[0];

  if (!selectedEmail || !selectedEmail.email) {
    throw new Error('Invalid email data in account');
  }

  return selectedEmail;
};

export const toCreateResponse = (account: Account): AccountCreateResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};

export const toUpdateResponse = (account: Account): AccountUpdateResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};

export const toListItemResponse = (
  account: Account
): AccountListItemResponse => {
  const email = getPrimaryEmail(account);
  return {
    _id: account._id.toString(),
    email: email.email,
    isPrimary: email.isPrimary,
  };
};
