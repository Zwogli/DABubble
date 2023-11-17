import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject} from 'rxjs';
import { User } from 'src/app/models/user.class';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar-header-mobile',
  templateUrl: './navbar-header-mobile.component.html',
  styleUrls: ['./navbar-header-mobile.component.scss']
})

export class NavbarHeaderMobileComponent {
  firestore: Firestore = inject(Firestore);
  currentUser!:User;
  currentUser$ = new BehaviorSubject<any>(this.currentUser);
  currentUserId:string | null = localStorage.getItem('userId');

  constructor(
    private navbarService: NavbarService,
    ) {
      this.readCurrentUser(this.currentUserId);
    }
    
  ngOnInit(){
  }

  readCurrentUser(userId:string | null){
    if(userId != null){
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.currentUser = user.data();
        this.currentUser$.next(this.currentUser);
      });
    }else{
      console.error('Error find no userId');
    }
  }

  openDialogProfilMenu(){
    this.navbarService.menuSlideUp('menu');
  }
}
