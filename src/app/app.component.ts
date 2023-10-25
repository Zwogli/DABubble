import { Component } from '@angular/core';
import { NavbarService } from './service/navbar/navbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DABubble';
  showMenu: boolean = false;
  private subscription: Subscription;
  
  constructor(private navbarService: NavbarService){
   this.subscription = this.navbarService.showMenu$.subscribe(
    visible => {
      this.showMenu = visible;
    }
   )
  }

  toggleMenu(){
    this.navbarService.toggleMenu()
  }
  
}
