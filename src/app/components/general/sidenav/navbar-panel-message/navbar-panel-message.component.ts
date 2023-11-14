import { Component, inject } from '@angular/core';
import { Firestore, QuerySnapshot, collection, doc, onSnapshot, query, where } from '@angular/fire/firestore';
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
  // currentUserId: any;
  // currentUser!: User;
  // subCurrentUser!: User;
  // private currentUserIsDestroyed$ = new Subject<boolean>();
  // userInChatsArray: Chat[] = [];
  // chatBetweenUserIds: string[] = [];
  // chatUserData: User[] = [];
  // chatsArray!:Chat[];
  // cacheChatUserData!: User;

  //!
  loggedUser!:User;
  loggedUserId = localStorage.getItem('userId');
  user_images = '../../../assets/img/avatar_female-v1.png';
  chats!: Chat[];

  chatFilteredUserIds!:string[];
  chatsUserData!:User[];
  //!

  
  constructor(
    private firestoreService: FirestoreService,
    private navbarService: NavbarService,
  ){
  }
  
  ngOnInit(){
    this.readLoggedUser(this.loggedUserId);
    this.readChatsFromUser(this.loggedUserId);
    // this.currentUser = this.firestoreService.currentUser;    
    // this.setCurrentUser();
    // this.setChatArray();
    // this.setChatUserData();
  }
  
  readLoggedUser(userId:string | null){
    if(userId != null){
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.loggedUser = user.data();
      });
    }else{
      console.log('Error find no userId');
    }
  }

  readChatsFromUser(userId:string | null) {
    if(userId != null){
    onSnapshot(query(collection(this.firestore, 'privateChat'),
      where('chatBetween', 'array-contains', userId)),
      (chatsArray) => {
        this.renderChatsArray(chatsArray)
        this.getUserIdsFromChats();
      });
    }else{
      console.log('Error find no chats');
    }
  }

  renderChatsArray(chatsArray:QuerySnapshot){
    this.chats = []; //reset variable array
    chatsArray.forEach((doc: any) => {  //read element of array
      this.chats.push(doc.data()); //element to array
    });
  }

  getUserIdsFromChats() {
    this.chatFilteredUserIds = [];
    this.chatFilteredUserIds.push(this.loggedUser.id);
    this.chats.forEach((chat) => {
     if(chat.id !== this.loggedUser.id){
       let filteredUserId = this.filterUserId(chat);
        this.chatFilteredUserIds.push(filteredUserId[0]);
     }
    });
    this.getUserDataFromChats();
  }

  filterUserId(chat:Chat){
    return chat.chatBetween.filter(
      (chatsUserId: string) => chatsUserId !== this.loggedUser.id);
  }


  async getUserDataFromChats(){
    this.chatsUserData = [];
    this.chatFilteredUserIds.forEach((chatsUserIds) =>{
      onSnapshot(
        doc(this.firestore, 'user', chatsUserIds), 
          (doc: any) => { 
            this.chatsUserData.push(doc.data());
          });
    });
  }

  retryLoadImage(user: User) {
    if (user) {
      user.photoUrl = this.user_images;
    }
  }

  /*
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
  */

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
