import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss']
})
export class DialogNewChannelComponent {
  setCurrentUser!:User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService, 
  ){}
  
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

  createChannel(){
    this.selectionUserIntoChannel();
  }

  selectionUserIntoChannel(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(radio != null){
      if(radio.id == 'radioAllUser'){
       this.firestoreService.addNewChannelAllUser(this.currentUser.id);
      }else if(radio.id == 'radioSingleUser'){
        this.firestoreService.addNewChannelSingleUser(this.currentUser.id);
      }
    }else{
      console.error('You have not selected anything');
    }
  }
  
  hideUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('show');
  }
  
  showUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.add('show');
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
