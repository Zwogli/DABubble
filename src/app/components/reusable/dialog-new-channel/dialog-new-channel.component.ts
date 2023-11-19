import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-channel',
  templateUrl: './dialog-new-channel.component.html',
  styleUrls: ['./dialog-new-channel.component.scss']
})
export class DialogNewChannelComponent {
  currentUser!:User;
  private currentUserIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private firestoreService:FirestoreService,
    private navbarService: NavbarService, 
    public router: Router,
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
      .subscribe((user: any) => {
        this.currentUser = user;
      });
  }

  createChannel(){
    debugger
    this.selectionUserIntoChannel();
    this.router.navigate(['home']);
  }

  async selectionUserIntoChannel(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(radio != null){
      if(radio.id == 'radioAllUser'){
       await this.firestoreService.addNewChannelWithAllUser(this.currentUser.id);
      }
      // else if(radio.id == 'radioSingleUser'){
      //   this.firestoreService.addNewChannelWithSingleUser(this.currentUser.id);
      // }
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
