import { Component } from '@angular/core';
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


  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
  }

  ngOnInit(){
    this.setCurrentUser();
    this.setMemberInChannelArray();
    console.log('Channel memberIn:', this.memberInChannelsArray,'element of', this.memberInChannelsArray.forEach((channel: any) => {
      console.log('show element of array: ', channel.name);
    }));
  }
  
  setMemberInChannelArray(){
    this.firestoreService.channelsArray$
    .pipe(takeUntil(this.currentUserIsDestroyed$)) // destroy subscribe
    .subscribe((channel: any) => {
      this.memberInChannelsArray = channel;
      console.log('channal sub: ', channel);
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
