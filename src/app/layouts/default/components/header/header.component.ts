import { Component } from '@angular/core';
import { ContextSwitcherComponent } from './components/context-switcher/context-switcher.component';

/** Header 元件 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ContextSwitcherComponent]
})
export class HeaderComponent {}
