import { Component } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {

  constructor(private navbarService: NavbarService) {
  }

  toggleMenu(){
    this.navbarService.menuSlideUp();
  }
}
