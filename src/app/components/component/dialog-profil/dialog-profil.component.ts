import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuProfilMobileComponent } from '../../wrapper/menu-profil-mobile/menu-profil-mobile.component';

@Component({
  selector: 'app-dialog-profil',
  templateUrl: './dialog-profil.component.html',
  styleUrls: ['./dialog-profil.component.scss']
})
export class DialogProfilComponent {
  constructor(public dialogRef: MatDialogRef<MenuProfilMobileComponent>,
    ){}
    
  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogProfilEdit(){}
}
