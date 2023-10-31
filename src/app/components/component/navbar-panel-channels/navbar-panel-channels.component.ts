import { ArrayType } from '@angular/compiler';
import { Component } from '@angular/core';
import { Subscription, takeUntil , pipe, Subject } from 'rxjs';
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

  // private subscription: Subscription;
  subCurrentUser!: User;
  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private firestoreService: FirestoreService
  ){
    this.currentUserId = localStorage.getItem("currentUserId")
    this.setCurrentUser();
  }
  
  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.componentIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
      // console.log('userData Channel: ', this.currentUser.memberInChannel);
    } )
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
