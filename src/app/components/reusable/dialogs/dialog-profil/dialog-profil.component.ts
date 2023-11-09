import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenuProfilMobileComponent } from '../../../general/sidenav/menu-profil-mobile/menu-profil-mobile.component';
import { DialogProfilEditComponent } from '../dialog-profil-edit/dialog-profil-edit.component';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-profil',
  templateUrl: './dialog-profil.component.html',
  styleUrls: ['./dialog-profil.component.scss'],
})
export class DialogProfilComponent {
  currentUser!: User;
  onlineStatus: boolean = false;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<MenuProfilMobileComponent>,
    public dialog: MatDialog,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        this.onlineStatus = user.onlineStatus;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialogProfilEdit() {
    this.dialog.open(DialogProfilEditComponent);
    this.onNoClick();
  }
}
