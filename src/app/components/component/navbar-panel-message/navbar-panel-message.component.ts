import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Chat } from 'src/app/models/chat.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-message',
  templateUrl: './navbar-panel-message.component.html',
  styleUrls: ['./navbar-panel-message.component.scss']
})
export class NavbarPanelMessageComponent {
  firestore: Firestore = inject(Firestore);
  panelOpenState: boolean = false;
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  userInChatsArray: Chat[] = [];
  chatBetweenUserIds: string[] = [];
  chatBetweenUserData: User[] = [];

  cacheChatUserData!: User;

  
  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
  }
  
  ngOnInit(){
    this.setCurrentUser();
    this.setUserInChatArray();
  }

  setUserInChatArray(){
    this.firestoreService.chatsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((chat: any) => {
      this.userInChatsArray = chat;
      // console.log('chat sub: ', chat);
    });
    this.getUserIdsChatBetween();
  }

  getUserIdsChatBetween(){
    this.chatBetweenUserIds = [];
    this.userInChatsArray.forEach((usersChatBetween) => {
      let chatUser = usersChatBetween.chatBetween.filter((user) => user !== this.currentUserId);
      this.chatBetweenUserIds.push(chatUser[0]);
    });
    // console.log('chat chatUser ', this.chatBetweenUserIds);
    //todo this.getUserDataChatBetween();
  }
// todo
  // getUserDataChatBetween(){
  //   this.chatBetweenUserData = [];
  //   this.chatBetweenUserIds.forEach((userIdChatBetween) => {

  //     onSnapshot(
  //       doc(this.firestore, 'user', userIdChatBetween), 
  //       (doc: any) => {
  //         this.cacheChatUserData = doc.data(); 
  //         this.chatBetweenUserData.push(this.cacheChatUserData);
  //         console.log('test: ', this.cacheChatUserData);
  //       });
        
  //       console.log('chat userIdChatBetween doc: ', this.chatBetweenUserData);
  //       // console.log('getUserChatBetween ', userDataChatBetween);
  //     });
  //     console.log('chat userData: ', this.chatBetweenUserData);
  // }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
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
