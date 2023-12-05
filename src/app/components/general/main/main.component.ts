import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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
  showMenu: boolean = false;
  showMainChat: boolean = false;
  showDialogCreateChannel: boolean = false;
  mobileView: boolean = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService, 
    public dialog: MatDialog,
    ){
      this.subscription = this.dialogService.showMenu$.subscribe(
        visible => {
          this.showMenu = visible;
        });
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
      this.subscription = this.dialogService.showDialogCreateChannel$.subscribe(
        visible => {
          this.showDialogCreateChannel = visible;
        });
  }
}
