import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { DialogProfilComponent } from '../../reusable/dialog-profil/dialog-profil.component';
import { Subscription } from 'rxjs';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';


@Component({
  selector: 'app-dialog-profil-menu',
  templateUrl: './dialog-profil-menu.component.html',
  styleUrls: ['./dialog-profil-menu.component.scss']
})
export class DialogProfilMenuComponent {
  mobileView: boolean = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService, 
    public dialog: MatDialog,
    public responsiveService: BreakpointObserverService, 
    ) {
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
    }

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.navbarService.toggleOverlay();
    this.authService.signOut();
  }

  closeMenu() {
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }
}