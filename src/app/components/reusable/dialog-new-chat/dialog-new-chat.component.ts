import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';

@Component({
  selector: 'app-dialog-new-chat',
  templateUrl: './dialog-new-chat.component.html',
  styleUrls: ['./dialog-new-chat.component.scss']
})
export class DialogNewChatComponent {
  @ViewChild('searchbarUser') searchbarUser!: ElementRef;
  mobileView: boolean = false;
  showDialogNewChat: boolean = false;
  showCloseAnimation:boolean = false;
  private subscription: Subscription;
  currentUser!:User;
  allUsers!:User[];
  filteredUser:User[] = [];
  selectedUser:User[] = [];
  userSelected:boolean = true;
  isAlreadyInChat:boolean = false;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  private allUsersIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private firestoreService:FirestoreService,
    public dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService, 
  ){
    this.subscription = this.responsiveService.mobileView$.subscribe(
      visible => {
        this.mobileView = visible;
      });
    this.subscription = this.dialogService.showDialogNewChat$.subscribe(
      visible => {
        this.showDialogNewChat = visible;
      });
  }
  
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
    if(searchbarValue === null || searchbarValue === ""){
      this.filteredUser = [];
    }else{
      this.filterForUser(searchbarValue);
    }
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

//<<<<<<<<<<<<<<<< slecet add/remove user >>>>>>>>>>>>
  selectUser(user:User){
    this.selectedUser.push(user);
    this.filteredUser = [];
    this.searchbarUser.nativeElement.value = null;
    this.userSelected = false;
  }

  removeUser(){
    this.selectedUser = [];
    this.userSelected = true;
    this.isAlreadyInChat = false;
  }

  submitNewChat(){
    this.isAlreadyInChat = false;
    this.checkIsAlreadyInChat();
    if(this.isAlreadyInChat){
      console.error('DABubble: chat already excist');
    }else{
      this.firestoreService.createNewChat(this.selectedUser[0]);
      this.removeUser();
    }
  }

  checkIsAlreadyInChat(){
    let selectedUserId = this.selectedUser[0].id;
    let allChatsUserData = this.firestoreService.chatUserData;
    allChatsUserData.forEach((user) => {
      if(user.id == selectedUserId){
        this.isAlreadyInChat = true;
      }
    })
  }

//<<<<<<<<<<<<<<<< manage dialog >>>>>>>>>>>>
  closeDialognewChat(){
    if(this.mobileView){
      this.showCloseAnimation = true;
      this.closeAnimation();
    }else{
      this.dialogService.showDialogNewChat();
    }
    this.removeUser();
  }

  closeAnimation(){
    if(this.showCloseAnimation){
      setTimeout(() => {
        this.dialogService.showDialogNewChat();
      }, 500);
    }
  }
}