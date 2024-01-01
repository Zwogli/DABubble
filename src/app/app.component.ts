import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResponsiveService } from './services/responsive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DABubble';

  // Auth gets instantiated to keep data from Fireservice
  // after manually reload of the page
  constructor(private auth: AuthService, public rs: ResponsiveService) {
    this.rs.isMobile$.subscribe((val) => {
      console.log('Mobile', val);
    });

    this.rs.isTablet$.subscribe((val) => {
      console.log('Tablet', val);
    });
    this.rs.isDesktop$.subscribe((val) => {
      console.log('Desktop', val);
    });
  }
}
