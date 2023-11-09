import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuProfilMobileComponent } from '../../../general/sidenav/menu-profil-mobile/menu-profil-mobile.component';
import { User } from 'src/app/models/user.class';
import { Subject, takeUntil } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-dialog-profil-edit',
  templateUrl: './dialog-profil-edit.component.html',
  styleUrls: ['./dialog-profil-edit.component.scss'],
})
export class DialogProfilEditComponent {
  currentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<MenuProfilMobileComponent>,
    private firestoreService: FirestoreService) {}

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
        });
    }
    
  onNoClick() {
    this.dialogRef.close();
  }
}
