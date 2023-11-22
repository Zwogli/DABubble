import { Component } from '@angular/core';
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
  currentUser!:User;
  private currentUserIsDestroyed$ = new Subject<boolean>();
  searchUserForm = new FormGroup({
    searchInputForm: new FormControl('', [
      Validators.minLength(2),
    ]),
  });
  filteredUser:User[] = [];
  // addedUser:User[] = [];

  constructor(
    private authService: AuthService,
    public firestoreService:FirestoreService,
    private navbarService: NavbarService, 
    public router: Router,
  ){}
  
  // sub currentUSer
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

  async createChannel(){
    await this.selectionUserIntoChannel();
  }

  async selectionUserIntoChannel(){
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
      console.error('You have not selected anything');
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

  async createNewChannel(){
    await this.firestoreService.addNewChannel(this.currentUser.id);
    await this.firestoreService.updateUsers();
    this.router.navigate(['home/', this.firestoreService.newChannelRefId]);
    this.resetVariables();
  }

  resetVariables(){
    this.firestoreService.usersAsMemberChache = [];
    this.firestoreService.newChannelRefId = '';
  }
  
  // show searchbar
  hideUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.add('hide');
    this.resetUserSearch();
  }

  resetUserSearch(){
    let inputSearchUser: any = document.getElementById('searchbar-user');
    if(inputSearchUser != null){
      inputSearchUser.value = null;
    }
    this.filteredUser = [];
    this.firestoreService.usersAsMemberChache = [];
  }
  
  showUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('hide');
  }

  // filter searched user
  get searchInputForm() {
    return this.searchUserForm.get('searchInputForm');
  }

  async searchForUser(){
    const input:any = document.getElementById('searchbar-user');
    let inputValue = input.value.toLowerCase();
    let allUser:User[] = [];
    const getColl = await this.firestoreService.setGetColl();
    this.filteredUser = [];
    
    if(this.isCheckedMinLetter(inputValue)){
      this.getAllUser(allUser, getColl);
      this.filterAllUser(allUser, inputValue);
    }
  }

  isCheckedMinLetter(inputValue:string){
    return inputValue.length > 1
  }

  getAllUser(allUser:User[], getColl:any){
    getColl.forEach((user:any) => {
      allUser.push(user.data())
    });
  }

  filterAllUser(allUser:User[], inputValue:string){
    allUser.forEach((user) => {
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

  // push searched user
  addFilteredUser(user:User){
    const input:any = document.getElementById('searchbar-user');
    input.value = null;
    this.filteredUser = [];
    this.firestoreService.usersAsMemberChache.push(user);
  }

  removeUser(user:User){
    let addedUserIndex = this.firestoreService.usersAsMemberChache.indexOf(user);
    if(addedUserIndex >= 0) {
      this.firestoreService.usersAsMemberChache.splice(addedUserIndex, 1);
    }
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
