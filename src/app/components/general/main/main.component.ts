import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showCloseAnimation:boolean = false;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService, 
    public dialog: MatDialog,
    ){}

    toggleNavbar(){
      this.dialogService.showNavbar();
    }

    
    closeDialogNewChat(){
      if(this.responsiveService.mobileView$.value){
        this.showCloseAnimation = true;
        this.closeAnimation();
      }else{
        this.dialogService.showDialogNewChat();
      }
    }
  
    closeAnimation(){
      if(this.showCloseAnimation){
        setTimeout(() => {
          this.showCloseAnimation = false;
          this.dialogService.showDialogNewChat();
        }, 500);
      }
    }
}
