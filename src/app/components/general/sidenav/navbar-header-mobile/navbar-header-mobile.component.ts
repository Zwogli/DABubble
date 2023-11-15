import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {
  firestore: Firestore = inject(Firestore);
  currentUser!:User;
  currentUserId:string | null = localStorage.getItem('userId');
  currentUserAvatar:string|null = localStorage.getItem('userAvatar');


  constructor(
    private navbarService: NavbarService,
    private firestoreService: FirestoreService,
    ) {
    }
    
  ngOnInit(){
    this.readCurrentUser(this.currentUserId);
  }

  readCurrentUser(userId:string | null){
    if(userId != null){
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.currentUser = user.data();
        localStorage.setItem('userAvatar', this.currentUser.photoUrl)
      });
    }else{
      console.log('Error find no userId');
    }
  }

  openMenu(){
    this.navbarService.menuSlideUp('menu');
  }
}
