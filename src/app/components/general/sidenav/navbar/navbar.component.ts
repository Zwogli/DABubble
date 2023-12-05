import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  mobileView: boolean = false;
  private subscription: Subscription;
  currentUserId:any;
  
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
  }

  ngOnInit(){
  }
  
  closeMenu(){
    setTimeout(() => {
      this.dialogService.toggleOverlay();
    }, 250);
    this.dialogService.menuSlideDown();
  }

}
