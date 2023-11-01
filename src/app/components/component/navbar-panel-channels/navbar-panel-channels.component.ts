import { ArrayType } from '@angular/compiler';
import { Component } from '@angular/core';
import { Subscription, takeUntil , pipe, Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
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
  memberInChannelsArray: Channel[] = [];
  test:any;
  // private subscription: Subscription;
  subCurrentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
    this.setCurrentUser();
    this.setMemberInChannelArray();
    // console.log('Channel memberIn:', this.memberInChannelsArray);
    console.log('Channel memberIn:', this.memberInChannelsArray,'element of', this.memberInChannelsArray.forEach((channel: any) => {
      console.log('show element of array: ', channel.name);
      
    }));
  }
  
  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setMemberInChannelArray(){
    this.firestoreService.channelsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((channels: any) => {
      this.memberInChannelsArray = channels;
      console.log('channal sub: ', channels);
      // this.currentUser = user;
      // this.memberInChannelsArray = channels;
    } )
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
      // console.log('userData Channel: ', this.currentUser);
    } )
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
