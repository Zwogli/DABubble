import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {
  private subscription: Subscription;
  showMenu: boolean = false;
  err_hash:boolean = false
  newChannelName:string = '';
  newChannelDescription:string = '';
  createChannelForm = new FormGroup({
    channelNameForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(17)
    ]),
  });

  constructor(
    private authService: AuthService,
    public firestoreService: FirestoreService,
    private navbarService: NavbarService, 
    ){
      this.subscription = this.navbarService.showMenu$.subscribe(
        visible => {
          this.showMenu = visible;
        });
    }

  inputCreateChannel(){
    const input:any = document.getElementById('create-channel');
    let inputValue = input.value;
    let sliceFirstLetter = inputValue.slice(0,1);
    this.checkInput(inputValue, sliceFirstLetter)
  }

  checkInput(inputValue:string, sliceFirstLetter:string){
    if(inputValue === ''){
      this.err_hash = false;
      this.firestoreService.channelAlreadyExist = false;
    }else if(sliceFirstLetter != '#'){
      this.errorInput();
    }else{
      this.err_hash = false;
      let newChannelName = inputValue.slice(1);
      this.firestoreService.checkChannelExist(newChannelName)
      this.newChannelName = newChannelName;
    }
  }

  manageDescription(){
    let desciptionInput: any = document.getElementById('channel-desciption');
    let description = desciptionInput.value;
    if(description === ''){
      this.newChannelDescription = '';
    }else{
      this.newChannelDescription = description
    }
  }

  errorInput(){
    this.err_hash = true;
    return console.error('Error forgot hashtag "#"');
  }

  get channelNameForm() {
    return this.createChannelForm.get('channelNameForm');
  }

  openMenu(){
    this.manageDescription();
    this.navbarService.menuSlideUp('menuCreateChannel');
  }
}
