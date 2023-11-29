import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
})
export class CreateChannelComponent {
  @ViewChild('inputCreateChannel') inputCreateChannel!: ElementRef;
  @ViewChild('channelDescription') channelDescription!: ElementRef;
  private subscription: Subscription;
  private allChannelsIsDestroyed$ = new Subject<boolean>();
  showMenu: boolean = false;
  err_hash: boolean = false;
  channelAlreadyExist: boolean = false;
  createChannelForm = new FormGroup({
    channelNameForm: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(17),
    ]),
  });
  allChannels: Channel[] = [];

  constructor(
    private authService: AuthService,
    public firestoreService: FirestoreService,
    private navbarService: NavbarService
  ) {
    this.subscription = this.navbarService.showMenu$.subscribe((visible) => {
      this.showMenu = visible;
    });
  }

  /**
   * subscribe
   */
  ngOnInit() {
    this.setAllChannels();
  }

  ngOnDestroy() {
    this.allChannelsIsDestroyed$.next(true);
  }

  setAllChannels() {
    this.firestoreService.allChannels$
      .pipe(takeUntil(this.allChannelsIsDestroyed$))
      .subscribe((channels: any) => {
        this.allChannels = channels;
      });
  }

  /**
   * check input
   */

  get channelNameForm() {
    return this.createChannelForm.get('channelNameForm');
  }

  checkInputCreateChannel() {
    const inputValue: any = this.inputCreateChannel.nativeElement.value;
    let sliceFirstLetter = inputValue.slice(0, 1);
    this.checkInput(inputValue, sliceFirstLetter);
  }

  checkInput(inputValue: string, sliceFirstLetter: string) {
    if (this.isEmptyString(inputValue)) {
      this.resetErrorMsg();
    } else if (this.isMissedHashtag(sliceFirstLetter)) {
      this.errorMsgMissedHashtag();
    } else {
      this.checkNewChannelName(inputValue);
    }
  }

  isEmptyString(value: string) {
    return value === '';
  }

  resetErrorMsg() {
    this.err_hash = false;
    this.channelAlreadyExist = false;
  }

  isMissedHashtag(firstLetter: string) {
    return firstLetter != '#';
  }

  errorMsgMissedHashtag() {
    this.err_hash = true;
    console.error('DABubble: Error forgot hashtag "#"');
  }

  checkNewChannelName(value: string) {
    this.err_hash = false;
    this.channelAlreadyExist = false;
    let newChannelNameSliced = value.slice(1);
    this.allChannels.forEach((channel) => {
      let channelName = this.toLowerCase(channel.name);
      let newChannelName = this.toLowerCase(newChannelNameSliced);
      if (channelName === newChannelName) {
        this.channelAlreadyExist = true;
      } else {
        this.firestoreService.newChannelName = newChannelNameSliced;
      }
    });
  }

  toLowerCase(name: string) {
    return name.toLowerCase();
  }

  submitNewChannel() {
    this.manageDescription();
    this.navbarService.manageOverlayNewChannel('menuNewChannel');
  }

  manageDescription() {
    let description: any = this.channelDescription.nativeElement.value;
    this.firestoreService.newChannelDescription = description;
  }
}
