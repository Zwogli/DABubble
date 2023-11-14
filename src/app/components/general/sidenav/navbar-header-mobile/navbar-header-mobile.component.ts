import { Component, inject } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
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
  // currentUser!: User;
  // private currentUserIsDestroyed$ = new Subject<boolean>();

  //! Test
  firestore: Firestore = inject(Firestore);
  loggedUser!:User;
  loggedUserId:string | null = localStorage.getItem('userId');
  loggedUserAvatar:string|null = localStorage.getItem('userAvatar');
  //!

  constructor(
    private navbarService: NavbarService,
    private firestoreService: FirestoreService,
    ) {
    }
    
  ngOnInit(){
    this.readLoggedUser(this.loggedUserId);
      // this.setCurrentUser();
  }

  readLoggedUser(userId:string | null){
    if(userId != null){
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.loggedUser = user.data();
        localStorage.setItem('userAvatar', this.loggedUser.photoUrl)
      });
    }else{
      console.log('Error find no userId');
    }
  }

/*
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
    console.log('header ', this.currentUser);
    
  }
*/
  openMenu(){
    this.navbarService.menuSlideUp('menu');
  }
}
