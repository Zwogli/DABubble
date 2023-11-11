import { Component } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
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
  currentUserId: any;
  currentUser!: User;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  memberInChannelsArray: Channel[] = [];

  // unsubCurrentUser!: Unsubscribe;


  constructor(
    private firestoreService: FirestoreService
  ){
    // this.unsubCurrentUser = this.firestoreService.unsubCurrentUser;
    this.currentUser = this.firestoreService.currentUser;
  }

  ngOnInit(){
    this.setCurrentUser();
    this.setMemberInChannelArray();
  }
  
  setMemberInChannelArray(){
    this.firestoreService.channelsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((channel: any) => {
      this.memberInChannelsArray = channel;
    });
    console.log('channalArray: ', this.memberInChannelsArray);
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

  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
