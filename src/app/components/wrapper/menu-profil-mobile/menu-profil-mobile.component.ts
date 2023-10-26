import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavbarService } from 'src/app/service/navbar/navbar.service';
import { DialogProfilComponent } from '../../component/dialog-profil/dialog-profil.component';

@Component({
  selector: 'app-menu-profil-mobile',
  templateUrl: './menu-profil-mobile.component.html',
  styleUrls: ['./menu-profil-mobile.component.scss']
})
export class MenuProfilMobileComponent {

  constructor(private navbarService: NavbarService, public dialog: MatDialog){
  }

  toggleMenu(){
    this.navbarService.closeMenu();
  }
  // toggleMenu(){
  //   let menu: HTMLElement | null = document.getElementById('menu');
  //   menu?.classList.remove('slide--up');
  //   menu?.classList.add('slide--down');

  //   setTimeout(() => {
  //     this.navbarService.toggleMenu();
  //   }, 1000);

  //   menu?.classList.add('slide--up');
  // }

  openDialogProfil(){
    this.dialog.open(DialogProfilComponent)
  }
}
