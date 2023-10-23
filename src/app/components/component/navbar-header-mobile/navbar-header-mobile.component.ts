import { Component } from '@angular/core';
import { NavbarService } from 'src/app/service/navbar/navbar.service';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {
  showMenu: boolean;

  constructor(private navbarService: NavbarService) {
    this.showMenu = this.navbarService.showMenu;
  }

  toggleMenu(){
    this.showMenu = this.navbarService.toggleMenu()
  }
}
