import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-panel-message',
  templateUrl: './navbar-panel-message.component.html',
  styleUrls: ['./navbar-panel-message.component.scss']
})
export class NavbarPanelMessageComponent {
  panelOpenState: boolean = false;
  // private subscription: Subscription;
  currentUser: String = '';

  constructor(private authService: AuthService){}

    ngOnInit(){
      this.currentUser = this.authService.currentUserId;
      console.log('currentUserId ', this.currentUser);
    }

  rotateArrow() {
    const channelArrow: any = document.getElementById(
      `directMessage--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
