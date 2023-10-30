import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/service/navbar/navbar.service';

@Component({
  selector: 'app-app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.scss']
})
export class AppBodyComponent {
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
    this.navbarService.closeMenu()
  }
}
