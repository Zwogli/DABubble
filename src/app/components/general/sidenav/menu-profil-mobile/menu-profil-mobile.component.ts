import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavbarService } from 'src/app/services/navbar.service';
import { DialogProfilComponent } from '../../../reusable/dialogs/dialog-profil/dialog-profil.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router,
    private navbarService: NavbarService, 
    public dialog: MatDialog,
    ) {
    this.subscription = this.navbarService.showMenu$.subscribe((visible) => {
      this.showMenu = visible;
    });
  }

  addUserRadio(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(radio != null){
      if(radio.id == 'radioAllUser'){
        console.log('Add all User to Channel');
      }else if(radio.id == 'radioSingleUser'){
        console.log('Add single User to Channel');
      }
    }else{
      console.log('You have not selected anything');
      
    }
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }

  openDialogProfil() {
    this.dialog.open(DialogProfilComponent);
  }

  logout(){
    this.navbarService.toggleOverlay();
    this.router.navigateByUrl('');
  }
}
