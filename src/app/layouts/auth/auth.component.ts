import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Auth Layout 元件 - 用於登入、註冊等頁面 */
@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class AuthLayoutComponent {}
