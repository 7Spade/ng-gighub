import { Component, Input } from '@angular/core';

/** Empty State 元件 - 顯示空狀態 */
@Component({
  selector: 'app-empty-state',
  template: '<div class="empty-state">{{ message }}</div>',
  standalone: true
})
export class EmptyStateComponent {
  @Input() message: string = 'No data';
}
