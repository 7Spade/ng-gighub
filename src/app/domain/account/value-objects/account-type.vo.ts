/**
 * Account Type Value Object
 * Represents the type of account in the system
 */
export enum AccountType {
  USER = 'user',
  ORGANIZATION = 'organization',
  BOT = 'bot'
}

/**
 * Type guard to check if a string is a valid AccountType
 */
export function isAccountType(value: string): value is AccountType {
  return Object.values(AccountType).includes(value as AccountType);
}
