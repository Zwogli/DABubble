import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';

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
    private dialogService: DialogManagerService,
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
        this.dialogService.toggleOverlay();
      }, 250);
      this.dialogService.menuSlideDown();
    }else{
      this.dialogService.hideDialog()
    }
  }
}