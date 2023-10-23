import { Component } from '@angular/core';
import { NavbarService } from 'src/app/service/navbar/navbar.service';

@Component({
  selector: 'app-menu-profil-mobile',
  templateUrl: './menu-profil-mobile.component.html',
  styleUrls: ['./menu-profil-mobile.component.scss']
})
export class MenuProfilMobileComponent {
  showMenu: boolean;

  constructor(private navbarService: NavbarService){
    this.showMenu = this.navbarService.showMenu;
  }
}
