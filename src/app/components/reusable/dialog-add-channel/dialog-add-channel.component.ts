import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent {
  createChannelForm = new FormGroup({
    channelNameForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(17)
    ]),
  });
  err_hash:boolean = false

  constructor(
    private authService: AuthService,
    public firestoreService: FirestoreService,
    public dialogService: DialogManagerService,
    public responsiveService: BreakpointObserverService,  
    ){}

  get channelNameForm() {
    return this.createChannelForm.get('channelNameForm');
  }

  inputCreateChannel(){
    const input:any = document.getElementById('create-channel');
    let inputValue = input.value;
    let sliceFirstLetter = inputValue.slice(0,1);
    this.checkInput(inputValue, sliceFirstLetter)
  }

  checkInput(inputValue:string, sliceFirstLetter:string){
    if(this.isEmptyString(inputValue)){
      this.resetErrorMsg();
    }else if(this.isMissedHashtag(sliceFirstLetter)){
      this.errorMsgMissedHashtag();
    }else{
      this.createChannel(inputValue);
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
    console.error('Error forgot hashtag "#"');
  }

  createChannel(value:string){
    this.err_hash = false;
    let newChannelName = value.slice(1);
    this.firestoreService.checkChannelExist(newChannelName)
    this.firestoreService.newChannelName = newChannelName;
  }

  openUserSelection(){
    this.manageDescription();
    this.dialogService.showDialogNewChannel();
  }

  manageDescription(){
    let desciptionInput: any = document.getElementById('channel-description');
    let description = desciptionInput.value;
    this.firestoreService.newChannelDescription = description
  }

  closeDialogCreateChannel(){
    this.resetErrorMsg();
    this.dialogService.showDialogAddChannel();
  }
}
