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
  showCloseAnimation:boolean = false;

  constructor(
    private authService: AuthService,
    public dialogService: DialogManagerService, 
    public dialog: MatDialog,
    public responsiveService: BreakpointObserverService, 
    ) {}

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.closeDialogMenu();
    this.authService.signOut();
  }

//<<<<<<<<<<<<<<<< manage dialog >>>>>>>>>>>>
  closeDialogMenu(){
    if(this.responsiveService.mobileView$.value){
      this.showCloseAnimation = true;
      this.closeAnimation();
    }else{
      this.dialogService.showDialogProfilMenu();
    }
  }

  closeAnimation(){
    if(this.showCloseAnimation){
      setTimeout(() => {
        this.dialogService.showDialogProfilMenu();
      }, 500);
    }
  }
}