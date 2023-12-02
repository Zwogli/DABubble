import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-overlay',
  templateUrl: './dialog-overlay.component.html',
  styleUrls: ['./dialog-overlay.component.scss']
})
export class DialogOverlayComponent {
  mobileView: boolean = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService,
    public responsiveService: BreakpointObserverService,
    ){
      this.subscription = this.responsiveService.mobileView$.subscribe(
        visible => {
          this.mobileView = visible;
        });
    }

  closeMenu() {
    if(this.mobileView){
      setTimeout(() => {
        this.navbarService.toggleOverlay();
      }, 250);
      this.navbarService.menuSlideDown();
    }else{
      this.navbarService.hideDialog()
    }
  }
}