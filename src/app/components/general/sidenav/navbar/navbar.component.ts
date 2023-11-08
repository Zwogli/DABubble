import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  private subscription: Subscription;
  
  constructor(private navbarService: NavbarService, public dialog: MatDialog){
    this.subscription = this.navbarService.showMenu$.subscribe(
      visible => {
        this.showMenu = visible;
      })
  }
  
  closeMenu(){
    this.navbarService.menuSlideDown();
  }

}
