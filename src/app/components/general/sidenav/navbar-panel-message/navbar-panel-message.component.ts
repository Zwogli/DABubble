import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subject, Subscription, of, takeUntil } from 'rxjs';
import { Chat } from 'src/app/models/chat.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

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
  chatUserData: User[] = [];
  chatsArray!:Chat[];

  cacheChatUserData!: User;

  
  constructor(
    private firestoreService: FirestoreService,
    private navbarService: NavbarService,
  ){
  }
  
  ngOnInit(){
    this.currentUser = this.firestoreService.currentUser;    
    this.setCurrentUser();
    this.setChatArray();
    this.setChatUserData();
  }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setChatArray(){
    this.firestoreService.chatsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((chatsArray: any) => {
      this.chatsArray = chatsArray;
    });
  }

  setChatUserData(){
    this.firestoreService.chatUserData$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((chatUser: any) => {
      this.chatUserData = chatUser;
    } )
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
  }

  toggleNewChat(){
    this.navbarService.menuSlideUp('menuNewChat');
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null= document.getElementById(
      `directMessage--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
