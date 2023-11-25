import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavbarService } from 'src/app/services/navbar.service';
import { DialogProfilComponent } from '../../../reusable/dialog-profil/dialog-profil.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-profil-mobile',
  templateUrl: './menu-profil-mobile.component.html',
  styleUrls: ['./menu-profil-mobile.component.scss'],
})
export class MenuProfilMobileComponent {
  showMenu: boolean = false;
  showMainChat: boolean = false;
  private subscription: Subscription;

  constructor(
    private navbarService: NavbarService, 
    public dialog: MatDialog,
    private authService: AuthService,
    ) {
    this.subscription = this.navbarService.showMenu$.subscribe((visible) => {
      this.showMenu = visible;
    });
  }

  createChannel(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(radio != null){
      if(radio.id == 'radioAllUser'){
        console.log('Add all User to Channel');
        this.renderAllUserinChannel();
      }else if(radio.id == 'radioSingleUser'){
        console.log('Add single User to Channel');
      }
    }else{
      console.log('You have not selected anything');
      
    }
  }

  renderAllUserinChannel(){
    
  }

  hideUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('show');
  }
  
  showUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.add('show');
  }

  closeMenu() {
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.navbarService.toggleOverlay();
    this.authService.signOut();
  }
}
