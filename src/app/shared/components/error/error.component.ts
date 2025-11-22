import { Component, Input } from '@angular/core';

/** Error 元件 - 顯示錯誤訊息 */
@Component({
  selector: 'app-error',
  template: '<div class="error">{{ message }}</div>',
  standalone: true,
})
export class ErrorComponent {
  @Input() message: string = '';
}
