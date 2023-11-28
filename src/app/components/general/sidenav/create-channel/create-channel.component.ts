import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('inputCreateChannel') inputCreateChannel!: ElementRef;
  @ViewChild('channelDescription') channelDescription!: ElementRef;
  private subscription: Subscription;
  showMenu: boolean = false;
  err_hash:boolean = false
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

  get channelNameForm() {
    return this.createChannelForm.get('channelNameForm');
  }

  checkInputCreateChannel(){
    const inputValue:any = this.inputCreateChannel.nativeElement.value;
    let sliceFirstLetter = inputValue.slice(0,1);
    this.checkInput(inputValue, sliceFirstLetter)
  }

  checkInput(inputValue:string, sliceFirstLetter:string){
    if(this.isEmptyString(inputValue)){
      this.resetErrorMsg();
    }else if(this.isMissedHashtag(sliceFirstLetter)){
      this.errorMsgMissedHashtag();
    }else{
      this.checkNewChannelName(inputValue);
    }
  }

  isEmptyString(value:string){
    return value === '';
  }

  resetErrorMsg(){
    this.err_hash = false;
    this.firestoreService.channelAlreadyExist = false;
  }

  isMissedHashtag(firstLetter:string){
    return firstLetter != '#';
  }

  errorMsgMissedHashtag(){
    this.err_hash = true;
    console.error('DABubble: Error forgot hashtag "#"');
  }

  checkNewChannelName(value:string){
    this.err_hash = false;
    let newChannelName = value.slice(1);
    this.firestoreService.checkChannelExist(newChannelName)
    this.firestoreService.newChannelName = newChannelName;
  }

  submitNewChannel(){
    this.manageDescription();
    this.navbarService.menuSlideUp('menuCreateChannel');
  }

  manageDescription(){
    let description: any = this.channelDescription.nativeElement.value;
    this.firestoreService.newChannelDescription = description
  }
}
