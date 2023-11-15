import { Component, inject } from '@angular/core';
import { Firestore, QuerySnapshot, collection, doc, onSnapshot, query, where } from '@angular/fire/firestore';
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
  panelOpenState: boolean = false; //material design
  firestore: Firestore = inject(Firestore);
  currentUser!:User;
  currentUserId = localStorage.getItem('userId');
  chats!: Chat[];
  chatFilteredUserIds!:string[];
  chatsUserData!:User[];
  
  users_photoUrl = '../../../assets/img/avatar_female-v1.png';
  // users_photoUrl:string;
  // users_onlinestatus:boolean;
  // users_name:string;

  
  constructor(
    private firestoreService: FirestoreService,
    private navbarService: NavbarService,
  ){
  }
  
  async ngOnInit(){
    this.readCurrentUser(this.currentUserId);
    this.readChatsFromUser(this.currentUserId);
  }
  
  readCurrentUser(userId:string | null){
    if(userId != null){
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.currentUser = user.data();
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
    this.chatFilteredUserIds.push(this.currentUser.id);
    this.chats.forEach((chat) => {
     if(chat.id !== this.currentUser.id){
       let filteredUserId = this.filterUserId(chat);
        this.chatFilteredUserIds.push(filteredUserId[0]);
     }
    });
    this.getUserDataFromChats();
  }

  filterUserId(chat:Chat){
    return chat.chatBetween.filter(
      (chatsUserId: string) => chatsUserId !== this.currentUser.id);
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

  retryLoadImage(user:User) {
    if (user) {
      user.photoUrl = this.users_photoUrl;
    }
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
