import { Directive, Input } from '@angular/core';

/** Permission Directive - 根據權限控制元素顯示 */
@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective {
  @Input() appPermission: string = '';
  // TODO: 實作權限檢查邏輯
}
