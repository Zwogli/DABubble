import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-chat',
  templateUrl: './dialog-new-chat.component.html',
  styleUrls: ['./dialog-new-chat.component.scss']
})
export class DialogNewChatComponent {

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService,
  ){}

  closeMenu() {
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }
}