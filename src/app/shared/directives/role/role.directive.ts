import { Directive, Input } from '@angular/core';

/** Role Directive - 根據角色控制元素顯示 */
@Directive({
  selector: '[appRole]',
  standalone: true,
})
export class RoleDirective {
  @Input() appRole: string = '';
  // TODO: 實作角色檢查邏輯
}
