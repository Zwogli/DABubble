import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavbarService } from 'src/app/services/navbar.service';
import { DialogProfilComponent } from '../../component/dialog-profil/dialog-profil.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-profil-mobile',
  templateUrl: './menu-profil-mobile.component.html',
  styleUrls: ['./menu-profil-mobile.component.scss']
})
export class MenuProfilMobileComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  private subscription: Subscription;

  constructor(private navbarService: NavbarService, public dialog: MatDialog){
    this.subscription = this.navbarService.showMenu$.subscribe(
      visible => {
        this.showMenu = visible;
      })
  }

  openMenu(){
    this.navbarService.toggleMenu();
    this.navbarService.menuSlideDown();
  }

  closeMenu(){
    this.navbarService.menuSlideDown();
  }

  openDialogProfil(){
    this.dialog.open(DialogProfilComponent)
  }
}
