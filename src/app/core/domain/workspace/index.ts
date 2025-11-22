/**
 * Workspace Domain Module
 * 
 * 匯出工作區領域層的所有公開介面
 */

// Aggregates
export * from './aggregates/workspace.aggregate';

// Entities
export * from './entities/workspace-member.entity';
export * from './entities/workspace-resource.entity';

// Value Objects
export * from './value-objects/workspace-id.vo';
export * from './value-objects/workspace-type.vo';
export * from './value-objects/workspace-slug.vo';
export * from './value-objects/member-role.vo';

// Events
export * from './events/workspace-created.event';
export * from './events/workspace-updated.event';
export * from './events/workspace-deleted.event';
export * from './events/member-added.event';
export * from './events/member-removed.event';
export * from './events/member-role-changed.event';
export * from './events/resource-added.event';
export * from './events/resource-removed.event';

// Repository Interface
export * from './repositories/workspace.repository.interface';
