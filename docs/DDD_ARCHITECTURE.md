# DDD Architecture Implementation

This directory contains the Domain-Driven Design (DDD) architecture for ng-gighub.

## Structure

### Domain Layer (`domain/`)
Contains business logic and domain models.

- **account/**: Account domain with polymorphic models (User, Organization, Bot)
  - `models/`: Domain entities
  - `value-objects/`: Value objects (AccountType, AccountRole)
  - `repositories/`: Repository interfaces
  - `services/`: Domain services (AccountSwitcher)

- **team/**: Team domain
  - `models/`: Team entity

- **repository/**: Repository domain
  - `models/`: Repository entity

### Application Layer (`application/`)
Contains use cases and application logic using CQRS pattern.

- **account/**: Account use cases
  - `commands/`: Write operations (switch, create)
  - `queries/`: Read operations (get, list)
  - `dto/`: Data transfer objects

- **organization/**: Organization-specific use cases
- **team/**: Team-specific use cases

### Presentation Layer (`presentation/`)
Contains UI components and state management.

- **store/**: State management using Angular signals
  - `account/`: Account state (current, accessible)
  - `organization/`: Organization state

- **layouts/**: Layout components
  - `default/components/account-switcher/`: Account switching UI

- **pages/**: Page components
  - `account/`: Account pages
  - `organization/`: Organization pages
  - `repositories/`: Repository pages

### Infrastructure Layer (`infrastructure/`)
Contains technical implementations.

- **supabase/**: Supabase integration
  - `repositories/`: Concrete repository implementations
  - `mappers/`: Domain-DB mapping (with polymorphism support)
  - `database.types.ts`: Generated TypeScript types from database

## Key Features

1. **Polymorphic Account System**: Base Account class with User, Organization, and Bot subclasses
2. **CQRS Pattern**: Separation of read (queries) and write (commands) operations
3. **Signal-based State**: Modern Angular signal-based state management
4. **Type Safety**: Full TypeScript type safety across all layers
5. **Clean Architecture**: Clear separation of concerns and dependencies

## Usage Examples

### Switching Accounts
```typescript
import { inject } from '@angular/core';
import { SwitchAccountCommandHandler } from './application/account';

const handler = inject(SwitchAccountCommandHandler);
handler.execute({ accountId: 'uuid' }).subscribe();
```

### Querying Accounts
```typescript
import { inject } from '@angular/core';
import { ListAccessibleAccountsQueryHandler } from './application/account';

const handler = inject(ListAccessibleAccountsQueryHandler);
handler.execute({ userId: 'uuid' }).subscribe(accounts => {
  console.log(accounts);
});
```

### Using Stores
```typescript
import { inject } from '@angular/core';
import { CurrentAccountStore } from './presentation/store';

const store = inject(CurrentAccountStore);
const account = store.account(); // Signal-based reactivity
```
