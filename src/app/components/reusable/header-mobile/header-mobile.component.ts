import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

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
    private navbarService: NavbarService,
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
    this.navbarService.menuSlideUp('menu');
  }

  navigateBack() {
    this.router.navigate(['/home/']);
  }
}
