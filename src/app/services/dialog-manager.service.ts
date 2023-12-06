import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  /** subjects */
  toggleDialogProfilMenuSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogAddChannelSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogNewChannelSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogNewChatSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** observable */
  showDialogProfilMenu$: Observable<boolean> = this.toggleDialogProfilMenuSubject.asObservable();
  showDialogAddChannel$: Observable<boolean> = this.toggleDialogAddChannelSubject.asObservable();
  showDialogNewChannel$: Observable<boolean> = this.toggleDialogNewChannelSubject.asObservable();
  showDialogNewChat$: Observable<boolean> = this.toggleDialogNewChatSubject.asObservable();

  constructor() { }

  showDialogProfilMenu(){
    const currentValue = this.toggleDialogProfilMenuSubject.value;
    this.toggleDialogProfilMenuSubject.next(!currentValue);
  }

  showDialogAddChannel(){
    const currentValue = this.toggleDialogAddChannelSubject.value;
    this.toggleDialogAddChannelSubject.next(!currentValue);
  }

  showDialogNewChannel(){
    const currentValue = this.toggleDialogNewChannelSubject.value;
    this.toggleDialogNewChannelSubject.next(!currentValue);
  }

  showDialogNewChat(){
    const currentValue = this.toggleDialogNewChatSubject.value;
    this.toggleDialogNewChatSubject.next(!currentValue);
  }
}
