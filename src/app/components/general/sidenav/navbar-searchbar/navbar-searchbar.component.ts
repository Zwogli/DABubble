import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-searchbar',
  templateUrl: './navbar-searchbar.component.html',
  styleUrls: ['./navbar-searchbar.component.scss']
})
export class NavbarSearchbarComponent {

  constructor(
    private authService: AuthService,
  ){}

}
