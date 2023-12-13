import { Component, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, Subscription, of, takeUntil } from 'rxjs';
import { Chat } from 'src/app/models/chat.class';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';

@Component({
  selector: 'app-navbar-panel-chat',
  templateUrl: './navbar-panel-chat.component.html',
  styleUrls: ['./navbar-panel-chat.component.scss']
})
export class NavbarPanelChatComponent {
  panelOpenState: boolean = true;
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  userInprivateChats: Chat[] = [];
  chatBetweenUserIds: string[] = [];
  chatUserData: User[] = [];
  chatUserData$ = new BehaviorSubject<any>(this.chatUserData);
  privateChats!:Chat[];
  privateChats$ = new BehaviorSubject<any>(this.privateChats);

  cacheChatUserData!: User;

  
  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService,
  ){}
  
  ngOnInit(){
    this.setCurrentUser();
    this.setChatArray();
    this.setChatUserData();
  }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  setChatArray(){
    this.firestoreService.privateChats$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((chats: any) => {
      this.privateChats = chats;
    });
  }

  setChatUserData(){
    this.firestoreService.chatUserData$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((chatUser: any) => {
      this.chatUserData = chatUser;
    } )
  }
  
  openDialogNewChat(){
    this.dialogService.showDialogNewChat();
  }
}