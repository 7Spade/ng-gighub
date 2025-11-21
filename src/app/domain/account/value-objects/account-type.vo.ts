/**
 * Account Type Value Object
 * Represents the type of account in the system
 */
export enum AccountType {
  USER = 'user',
  ORGANIZATION = 'organization',
  BOT = 'bot'
}

export function isValidAccountType(type: string): type is AccountType {
  return Object.values(AccountType).includes(type as AccountType);
}
