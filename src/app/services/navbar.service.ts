import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DialogManagerService } from './dialog-manager.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  /** helpfull trick to create observable boolean */
  showMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) // behaviorSubject near a observable
  showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();  // change behaviorSubject -> observable
  /** */
  toggleOverlayNewChatSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showOverlayNewChat$: Observable<boolean> = this.toggleOverlayNewChatSubject.asObservable();
  selectedMenu:string = '';

  constructor(
    private dialogService: DialogManagerService,
  ) { }

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

    activMenu?.classList.add('slide--up');
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
    const currentValue = this.toggleOverlayNewChatSubject.value;
    this.toggleOverlayNewChatSubject.next(!currentValue);
  }

  toggleOverlay() {
    const currentValue = this.showMenuSubject.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenuSubject.next(!currentValue);  // next change the negated value
  }
}
