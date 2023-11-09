import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {
  currentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private navbarService: NavbarService,
    private firestoreService: FirestoreService,
    ) {
  }

  ngOnInit(){
    this.setCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
  }

  toggleMenu(){
    this.navbarService.menuSlideUp();
  }
}
