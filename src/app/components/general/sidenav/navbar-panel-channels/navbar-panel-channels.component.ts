import { Component, inject } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
import { Firestore, collection, doc, onSnapshot, query, where } from '@angular/fire/firestore';
import { takeUntil ,  Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss']
})

export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;

  // currentUserId: any;
  // currentUser!: User;
  // subCurrentUser!: User;
  // private currentUserIsDestroyed$ = new Subject<boolean>();
  // memberInChannelsArray: Channel[] = [];

  // unsubCurrentUser!: Unsubscribe;

  //!
  firestore: Firestore = inject(Firestore);
  loggedUser!:User;
  loggedUserId = localStorage.getItem('userId');
  channels!: Channel[];
  //!

  constructor(
    private firestoreService: FirestoreService
  ){
    // this.currentUser = this.firestoreService.currentUser;
  }

  ngOnInit(){
    this.readLoggedUser(this.loggedUserId);
    this.getChannelsFromCurrentUser(this.loggedUserId);
    
    /*this.setCurrentUser();
    this.setMemberInChannelArray();*/
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

  getChannelsFromCurrentUser(userId:string | null) {
    if(userId != null){
      onSnapshot(query(collection(this.firestore, 'channels'), 
        where('member', 'array-contains', userId)),
        (memberInChannel) => {
          this.channels = []; 
          memberInChannel.forEach((doc:any) => {
            this.channels.push(doc.data()); //element to array
          });
        }
      );
    }else{
      console.log('Error find no channels!');
    }
  }
  
  /*
  setMemberInChannelArray(){
    this.firestoreService.channelsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((channel: any) => {
      this.memberInChannelsArray = channel;
    });
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
*/
  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
