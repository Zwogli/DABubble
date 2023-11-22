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

  constructor(
    private authService: AuthService,
    private firestoreService:FirestoreService,
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
        this.renderAllUserIntoNewChannel();
      }

      else if(this.isSelectSingleUser(radio)){
        console.log('Add single user');
        
      //   this.firestoreService.addNewChannelWithSingleUser(this.currentUser.id);
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

  async renderAllUserIntoNewChannel(){
    await this.firestoreService.getAllUser();
    await this.firestoreService.addNewChannel(this.currentUser.id);
    await this.firestoreService.updateUsers();
    this.router.navigate(['home/', this.firestoreService.newChannelRefId]);
    this.resetVariables();
  }

  resetVariables(){
    this.firestoreService.allUserAsMember = [];
    this.firestoreService.newChannelRefId = '';
  }
  
  // search single user 
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
  }
  
  showUserSearchbarNewChannel(){
    let showContainerSearch: HTMLElement | null = document.getElementById('new-channel-search-user');
    showContainerSearch?.classList.remove('hide');
  }

  async searchForUser(){
    const input:any = document.getElementById('searchbar-user');
    let inputValue = input.value.toLowerCase();
    let allUser:User[] = [];
    const getColl = await this.firestoreService.setGetColl();
    this.filteredUser = [];
    
    if(inputValue.length > 1){
      this.getAllUser(allUser, getColl);
      this.filterAllUser(allUser, inputValue);
    }
  }

  getAllUser(allUser:User[], getColl:any){
    getColl.forEach((user:any) => {
      allUser.push(user.data())
    });
  }

  filterAllUser(allUser:User[], inputValue:string){
    
    allUser.forEach((user) => {
      let userName = user.name.toLowerCase();
      if(userName.includes(inputValue)){
        console.log(user.name);
        this.filteredUser.push(user);
      }
    })
  }

  get searchInputForm() {
    return this.searchUserForm.get('searchInputForm');
  }

  closeMenu() {
    this.navbarService.menuSlideDown();
  }
}
