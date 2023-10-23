import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {
  showMenu: boolean = false;

  constructor() {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
