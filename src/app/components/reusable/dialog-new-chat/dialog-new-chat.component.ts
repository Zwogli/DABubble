import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-dialog-new-chat',
  templateUrl: './dialog-new-chat.component.html',
  styleUrls: ['./dialog-new-chat.component.scss']
})
export class DialogNewChatComponent {
  @ViewChild('searchbarUser') searchbarUser!: ElementRef;
  currentUser!:User;
  allUsers!:User[];
  filteredUser:User[] = [];
  selectedUser:User[] = [];
  userSelected:boolean = true;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  private allUsersIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private firestoreService:FirestoreService,
    private navbarService: NavbarService,
  ){}
  
//<<<<<<<<<<<<<<<< subscribe >>>>>>>>>>>>
  ngOnInit() {
    this.setCurrentUser();
    this.setAllUser();
  }

  ngOnDestroy() {
    this.currentUserIsDestroyed$.next(true);
    this.allUsersIsDestroyed$.next(true);
  }

  setCurrentUser() {
    this.firestoreService.currentUser$
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: any) => {
        this.currentUser = user;
      });
  }

  setAllUser() {
    this.firestoreService.allUsers$
      .pipe(takeUntil(this.allUsersIsDestroyed$))
      .subscribe((users: any) => {
        this.allUsers = users;
      });
  }

//<<<<<<<<<<<<<<<< search user >>>>>>>>>>>>
searchForUser(){
  let searchbarValue = this.searchbarUser.nativeElement.value.toLowerCase();
  this.filteredUser = [];
  this.filterForUser(searchbarValue);
}

filterForUser(inputName:string){
  this.allUsers.forEach((user) => {
    let userName = user.name.toLowerCase();
    if(this.isCheckedInput(inputName, userName)){
      this.filteredUser.push(user);
    }
  })
}

isCheckedInput(inputName:string, userName:string){
  return userName.includes(inputName) &&
  !userName.includes(this.currentUser.name);
}

//<<<<<<<<<<<<<<<< slecet user >>>>>>>>>>>>
  selectUser(user:User){
    this.selectedUser.push(user);
    this.filteredUser = [];
    this.searchbarUser.nativeElement.value = null;
    this.userSelected = false;
  }

  removeUser(){
    let user = this.selectedUser[0];
    let userIndexOf = this.selectedUser.indexOf(user);
    this.selectedUser.splice(userIndexOf,1);
    this.userSelected = true;
  }



submitNewChat(){
  console.log('show all user', this.selectedUser);
  this.selectedUser = [];
  
}

//<<<<<<<<<<<<<<<< manage overlay/menu >>>>>>>>>>>>
  closeMenu() {
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }
}