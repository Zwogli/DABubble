import { ArrayType } from '@angular/compiler';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss']
})

export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;
  currentUser: any;
  user:any;

  userData: any;
  channel:any = [];
  privateChat:any = [];


  constructor(
    private authService: AuthService, 
    private firestoreService: FirestoreService
  ){
    
  }

  ngOnInit(){
    this.renderInit();
    this.renderDoc();
    console.log('currentUserData: ', this.firestoreService.currentUserData);
    
  }

  renderInit(){
    this.currentUser = this.authService.currentUserId;
  }

  renderDoc(){
    this.firestoreService.readDoc('user', this.currentUser);
  }

  rotateArrow() {
    const channelArrow: any = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
