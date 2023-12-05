import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  /** subjects */
  showMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) // behaviorSubject near a observable
  toggleDialogProfilMenuSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogAddChannelSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogNewChannelSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleDialogNewChatSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** observable */
  showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();  // change behaviorSubject -> observable
  showDialogProfilMenu$: Observable<boolean> = this.toggleDialogProfilMenuSubject.asObservable();
  showDialogAddChannel$: Observable<boolean> = this.toggleDialogAddChannelSubject.asObservable();
  showDialogNewChannel$: Observable<boolean> = this.toggleDialogNewChannelSubject.asObservable();
  showDialogNewChat$: Observable<boolean> = this.toggleDialogNewChatSubject.asObservable();

  selectedMenu:string = '';

  constructor() { }
  showDialog(selectedMenu:string){
    this.selectedMenu = selectedMenu;
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    this.toggleOverlay();
    activMenu?.classList.remove('slide--down');
    activMenu?.classList.remove('slide--up');
    activMenu?.classList.remove('hide');
  }

  hideDialog(){
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    this.toggleOverlay();
    activMenu?.classList.add('hide');
  }
  
  menuSlideUp(selectedMenu:string){
    this.selectedMenu = selectedMenu;
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);

    this.toggleOverlay();
    activMenu?.classList.remove('slide--down');
    activMenu?.classList.add('slide--up');
  }

  menuSlideDown(){
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    activMenu?.classList.remove('slide--up');
    activMenu?.classList.add('slide--down');

    // activMenu?.classList.add('slide--up');
    this.selectedMenu = '';
  }

  manageOverlayNewChat(menuId:string){
    this.toggleOverlayNewChat();
    this.selectedMenu = menuId;
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    activMenu?.classList.remove('slide--down');
    activMenu?.classList.add('slide--up');
  }

  toggleOverlayNewChat(){
    const currentValue = this.toggleDialogNewChatSubject.value;
    this.toggleDialogNewChatSubject.next(!currentValue);
  }

  toggleOverlay() {
    const currentValue = this.showMenuSubject.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenuSubject.next(!currentValue);  // next change the negated value
  }

  /**
   * new dialog managment
   */
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
}
