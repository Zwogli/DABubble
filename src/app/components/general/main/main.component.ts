import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  mobileView: boolean = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private navbarService: NavbarService,
    public responsiveService: BreakpointObserverService, 
    public dialog: MatDialog,
    ){
      this.subscription = this.navbarService.showMenu$.subscribe(
        visible => {
          this.showMenu = visible;
        });
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
  }
}
