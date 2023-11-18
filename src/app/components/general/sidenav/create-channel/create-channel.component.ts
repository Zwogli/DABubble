import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {

  constructor(
    private navbarService: NavbarService,
    private authService: AuthService,
    ){}

  openMenu(){
    this.navbarService.menuSlideUp('menuCreateChannel');
  }

}
