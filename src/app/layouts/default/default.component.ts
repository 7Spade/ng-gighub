import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

/** Default Layout 元件 */
@Component({
  selector: 'app-default-layout',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class DefaultLayoutComponent {}
