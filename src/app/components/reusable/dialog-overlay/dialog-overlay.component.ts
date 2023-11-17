import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-overlay',
  templateUrl: './dialog-overlay.component.html',
  styleUrls: ['./dialog-overlay.component.scss']
})
export class DialogOverlayComponent {

  constructor(private navbarService: NavbarService, ){}

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
