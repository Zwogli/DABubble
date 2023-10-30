import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenuProfilMobileComponent } from '../../wrapper/menu-profil-mobile/menu-profil-mobile.component';
import { DialogProfilEditComponent } from '../dialog-profil-edit/dialog-profil-edit.component';

@Component({
  selector: 'app-dialog-profil',
  templateUrl: './dialog-profil.component.html',
  styleUrls: ['./dialog-profil.component.scss']
})
export class DialogProfilComponent {
  constructor(public dialogRef: MatDialogRef<MenuProfilMobileComponent>,
    public dialog: MatDialog,
    ){}
    
  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogProfilEdit(){
    this.dialog.open(DialogProfilEditComponent);
    this.onNoClick();
  }
}
