import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss'],
})
export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;
  firestore: Firestore = inject(Firestore);
  currentUser!: User;
  currentUserId = localStorage.getItem('userId');
  channels!: Channel[];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.readCurrentUser(this.currentUserId);
    this.getChannelsFromCurrentUser(this.currentUserId);
  }

  readCurrentUser(userId: string | null) {
    if (userId != null) {
      onSnapshot(doc(this.firestore, 'user', userId), (user: any) => {
        this.currentUser = user.data();
      });
    } else {
      console.log('Error find no userId');
    }
  }

  getChannelsFromCurrentUser(userId: string | null) {
    if (userId != null) {
      onSnapshot(
        query(
          collection(this.firestore, 'channels'),
          where('member', 'array-contains', userId)
        ),
        (memberInChannel) => {
          this.channels = [];
          memberInChannel.forEach((doc: any) => {
            this.channels.push(doc.data()); //element to array
          });
        }
      );
    } else {
      console.log('Error find no channels!');
    }
  }

  rotateArrow() {
    const channelArrow: HTMLElement | null = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow?.classList.toggle('rotate');
  }
}
