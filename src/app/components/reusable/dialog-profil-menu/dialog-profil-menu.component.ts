import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
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
  showDialogProfilMenu: boolean = false;
  showCloseAnimation:boolean = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private dialogService: DialogManagerService, 
    public dialog: MatDialog,
    public responsiveService: BreakpointObserverService, 
    ) {
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
      this.subscription = this.dialogService.showDialogProfilMenu$.subscribe(
        visible => {
          this.showDialogProfilMenu = visible;
        });
    }

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.authService.signOut();
  }

  closeDialogMenu(){
    this.showCloseAnimation = true;
    if(this.showCloseAnimation){
      setTimeout(() => {
        this.dialogService.showDialogProfilMenu();
      }, 500);
    }
  }
}