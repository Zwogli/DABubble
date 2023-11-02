import { Component } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-message',
  templateUrl: './navbar-panel-message.component.html',
  styleUrls: ['./navbar-panel-message.component.scss']
})
export class NavbarPanelMessageComponent {
  panelOpenState: boolean = false;
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private componentIsDestroyed$ = new Subject<boolean>();

  
  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
    this.setCurrentUser();
  }

  // setUserInChatArray(){
  //   this.firestoreService.chatsArray$
  //   .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
  //   .subscribe((chat: any) => {
  //     this.userInChatsArray = chat;
  //     console.log('channal sub: ', chat);
  //   });
  // }
  
  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.componentIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
      // console.log('userData Chat: ', this.currentUser.memberInChannel);
    } )
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null= document.getElementById(
      `directMessage--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
