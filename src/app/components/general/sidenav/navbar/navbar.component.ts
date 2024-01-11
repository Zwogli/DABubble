import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  private subscription: Subscription;
  currentUserId:any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private navbarService: NavbarService,
    public dialog: MatDialog,
    public rs: ResponsiveService
    ){
      this.subscription = this.navbarService.showMenu$.subscribe(
        visible => {
          this.showMenu = visible;
        });
  }

  ngOnInit(){
    this.authService.getCurrentUser();
  }

  closeMenu(){
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }

}
