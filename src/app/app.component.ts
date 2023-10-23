import { Component } from '@angular/core';
import { NavbarService } from './service/navbar/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DABubble';
  showMenu: boolean;
  
  constructor(private navbarService: NavbarService){
    this.showMenu = this.navbarService.showMenu;
  }

  toggleMenu(){
    console.log(this.showMenu);
    
    this.showMenu = this.navbarService.toggleMenu()
  }
  
}
