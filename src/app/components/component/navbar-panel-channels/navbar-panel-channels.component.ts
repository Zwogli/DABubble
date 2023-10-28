import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss']
})
export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;
  currentUser: String = '';

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.currentUser = this.authService.currentUserId;
    console.log('currentUserId ', this.currentUser);
  }

  rotateArrow() {
    const channelArrow: any = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
