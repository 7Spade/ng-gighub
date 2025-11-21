/**
 * Barrel export for domain layer models
 */

// Account domain
export * from './domain/account/models/account.model';
export * from './domain/account/models/user-account.model';
export * from './domain/account/models/organization-account.model';
export * from './domain/account/models/bot-account.model';
export * from './domain/account/value-objects/account-type.vo';
export * from './domain/account/value-objects/account-role.vo';
export * from './domain/account/repositories/account.repository.interface';
export * from './domain/account/services/account-domain.service';
export * from './domain/account/services/account-switcher.service';

// Team domain
export * from './domain/team/models/team.model';
export * from './domain/team/services/team-domain.service';

// Repository domain
export * from './domain/repository/models/repository.model';
export * from './domain/repository/services/repository-permission.service';

// Application layer
export * from './application/account/dto/account.dto';
export * from './application/account/commands/switch-account.command';
export * from './application/account/commands/create-user-account.command';
export * from './application/account/commands/create-organization.command';
export * from './application/account/commands/create-bot.command';
export * from './application/account/queries/get-current-account.query';
export * from './application/account/queries/list-accessible-accounts.query';
export * from './application/account/queries/get-account-by-username.query';

// Infrastructure layer
export * from './infrastructure/supabase/mappers/account.mapper';
export * from './infrastructure/supabase/mappers/team.mapper';
export * from './infrastructure/supabase/repositories/account.repository';

// Presentation layer
export * from './presentation/store/account/current-account.store';
export * from './presentation/store/account/accessible-accounts.store';
export * from './presentation/layouts/default/default-layout.component';
export * from './presentation/layouts/default/components/account-switcher/account-switcher.component';
