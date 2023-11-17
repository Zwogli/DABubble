import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { DialogProfilComponent } from '../../reusable/dialog-profil/dialog-profil.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-profil-menu',
  templateUrl: './dialog-profil-menu.component.html',
  styleUrls: ['./dialog-profil-menu.component.scss']
})
export class DialogProfilMenuComponent {

  constructor(
    private navbarService: NavbarService, 
    public dialog: MatDialog,
    private authService: AuthService,
    ) {}

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.navbarService.toggleOverlay();
    this.authService.signOut();
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
