import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  searchUserForm = new FormGroup({
    searchInputForm: new FormControl('', [
      Validators.minLength(2),
    ]),
  });
  @ViewChild('inputSearchbarUser') inputSearchbarUser!: ElementRef;
  currentUser!:User;
  allUsers!:User[];
  filteredUser:User[] = [];
  alreadyFiltered:boolean = false;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  private allUsersIsDestroyed$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    public firestoreService:FirestoreService,
    private navbarService: NavbarService, 
    public router: Router,
  ){}
  
  /**
   * sub currentUSer
   */

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

  /**
   * manage selection
   */
  async submitCreateChannel(){
    await this.manageAddUsers();
  }

  async manageAddUsers(){
    let radio = document.querySelector('input[name="addOption"]:checked');
    if(this.isNotNull(radio)){

      if(this.isSelectAllUser(radio)){
        await this.firestoreService.getAllUser();
        this.createNewChannel();
      }else 
      if(this.isSelectSingleUser(radio)){
        this.firestoreService.usersAsMemberChache.push(this.currentUser)
        this.createNewChannel();
      }
    }else{
      console.error('DABubble: No selection found');
    }
  }

  isNotNull(selection:any){
    return selection != null;
  }

  isSelectAllUser(selection:any){
    return selection.id == 'radioAllUser';
  }

  isSelectSingleUser(selection:any){
    return selection.id == 'radioSingleUser';
  }

  /**
   * create channel
   */

  async createNewChannel(){
    await this.firestoreService.addNewChannel(this.currentUser.id);
    await this.firestoreService.updateUsers();
    this.navbarService.toggleOverlay();
    this.resetVariables();
    this.router.navigate(['home/', this.firestoreService.newChannelRefId]);
  }

  resetVariables(){
    this.filteredUser = [];
    this.firestoreService.usersAsMemberChache = [];
    this.firestoreService.newChannelRefId = '';
  }
  
  /**
   * manage searchbar
   */

  showSearchbar(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('hide');
    this.resetSearchbarValue()
  }

  hideSearchbar(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.add('hide');
    this.resetSearchbarValue();
    this.resetVariables();
  }

  resetSearchbarValue(){
    let inputSearchUser: any = document.getElementById('searchbar-user');
    if(inputSearchUser != null){
      inputSearchUser.value = null;
    }
  }

  /**
   * filter searched user
   */
  
  get searchInputForm() {
    return this.searchUserForm.get('searchInputForm');
  }

  async searchForUser(){
    const inputValue:any = this.inputSearchbarUser.nativeElement.value;
    const cleanValue = inputValue.toLowerCase();
    this.filteredUser = [];
    if(this.isCheckedMinLetter(cleanValue)){
      this.filterAllUser(cleanValue);
    }
  }

  isCheckedMinLetter(inputValue:string){
    return inputValue.length > 1
  }

  filterAllUser(inputValue:string){
    this.allUsers.forEach((user) => {
      let userName = user.name.toLowerCase();
      if(this.isFilteredUser(userName, inputValue)){
        this.filteredUser.push(user);
      }
    })
  }

  isFilteredUser(userName:any, inputValue:string){
    return userName.includes(inputValue) && 
    !userName.includes(this.currentUser.name)
  }

  /**
   * add filtered user
   */

  resetErrorMsg(){
    this.alreadyFiltered = false;
  }

  addFilteredUser(user:User){
    const input:any = document.getElementById('searchbar-user');
    input.value = null;
    this.filteredUser = [];
    this.alreadyFiltered = false;
    this.isAlreadyFiltered()
    if(this.alreadyFiltered){
      console.error('User already added', this.alreadyFiltered);
    }else{
      this.firestoreService.usersAsMemberChache.push(user);
    }
  }

  isAlreadyFiltered(){
    this.firestoreService.usersAsMemberChache.forEach((user)=>{
      if(user === user){
        this.alreadyFiltered = true;
      }else{
        this.alreadyFiltered = false;
      }
    })
  }

  removeUser(user:User){
    let addedUserIndex = this.firestoreService.usersAsMemberChache.indexOf(user);
    if(addedUserIndex >= 0) {
      this.firestoreService.usersAsMemberChache.splice(addedUserIndex, 1);
    }
  }

  /**
   * manage overlay / menu 
   */

  closeMenu() {
    // todo fix overlay
    let radioBtnAll:any = document.getElementById('radioAllUser');
    let radioBtnSingle:any = document.getElementById('radioSingleUser');
    if(radioBtnSingle.checked = true){
      radioBtnSingle.checked = false;
      radioBtnAll.checked = true;
    }
    this.hideSearchbar();
    setTimeout(() => {
      this.navbarService.toggleOverlay();
    }, 250);
    this.navbarService.menuSlideDown();
  }
}
