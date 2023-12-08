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
  mobileView: boolean = false;
  showDialogProfilMenu: boolean = false;
  showDialogAddChannel: boolean = false;
  showDialogNewChat: boolean = false;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService, 
    public dialog: MatDialog,
    ){}

}
