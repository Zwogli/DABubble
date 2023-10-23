import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss'],
})
export class NavbarHeaderMobileComponent {
  showMenu: boolean = false;

  constructor(public dialog: MatDialog) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
