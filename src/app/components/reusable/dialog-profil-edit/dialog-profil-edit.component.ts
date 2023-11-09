import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuProfilMobileComponent } from '../../wrapper/menu-profil-mobile/menu-profil-mobile.component';

@Component({
  selector: 'app-dialog-profil-edit',
  templateUrl: './dialog-profil-edit.component.html',
  styleUrls: ['./dialog-profil-edit.component.scss']
})
export class DialogProfilEditComponent {

  constructor(public dialogRef: MatDialogRef<MenuProfilMobileComponent>){}

  onNoClick(){
    this.dialogRef.close();
  }
}
