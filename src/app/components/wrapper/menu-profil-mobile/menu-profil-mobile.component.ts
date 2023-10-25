import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavbarService } from 'src/app/service/navbar/navbar.service';
import { DialogProfilComponent } from '../../component/dialog-profil/dialog-profil.component';

@Component({
  selector: 'app-menu-profil-mobile',
  templateUrl: './menu-profil-mobile.component.html',
  styleUrls: ['./menu-profil-mobile.component.scss']
})
export class MenuProfilMobileComponent {

  constructor(private navbarService: NavbarService, public dialog: MatDialog){
  }

  openDialogProfil(){
    this.dialog.open(DialogProfilComponent)
  }
}
