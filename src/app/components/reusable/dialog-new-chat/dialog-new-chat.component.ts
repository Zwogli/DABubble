import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-chat',
  templateUrl: './dialog-new-chat.component.html',
  styleUrls: ['./dialog-new-chat.component.scss']
})
export class DialogNewChatComponent {

  constructor(
    private navbarService: NavbarService,
  ){}

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
