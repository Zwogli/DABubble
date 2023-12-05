import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})

export class HeaderMobileComponent {
  @Input() parent!: string; 
  currentUser!: User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  mobileView: boolean = false;
  private subscription: Subscription;

  constructor(
    private dialogService: DialogManagerService,
    private router: Router,
    private firestoreService: FirestoreService,
    public responsiveService: BreakpointObserverService, 
    ) {
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
    }
    
  ngOnInit(){
      this.setCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
    this.currentUserIsDestroyed$.complete();
  }
  
  setCurrentUser() {
    this.firestoreService.currentUser$
    .pipe(takeUntil(this.currentUserIsDestroyed$))
    .subscribe((user: User) => {
      this.currentUser = user;
    } )
  }

  openMenu(){
    if(this.mobileView){
      this.dialogService.menuSlideUp('dialog-profil-menu');
    }else{
      this.dialogService.showDialog('dialog-profil-menu');
    }
  }

  navigateBack() {
    this.router.navigate(['/home/']);
  }
}
