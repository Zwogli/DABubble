import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  /** helpfull trick to create observable boolean */
  showMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) // behaviorSubject near a observable
  showMenu$: Observable<boolean> = this.showMenu.asObservable();  // change behaviorSubject -> observable
  /** */
  selectedMenu:string = '';

  constructor() { }

  menuSlideUp(selectedMenu:string){
    this.selectedMenu = selectedMenu
    // let menu: HTMLElement | null = document.getElementById('menu');
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);

    this.toggleOverlay();
    activMenu?.classList.remove('slide--down');
    activMenu?.classList.add('slide--up');
  }

  // newChatSlideUp(){
  //   this.toggleOverlay();
  //   let menu: HTMLElement | null = document.getElementById('menuNewChat');
  //   menu?.classList.remove('slide--down');
  //   menu?.classList.add('slide--up');
  // }

  menuSlideDown(){
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    activMenu?.classList.remove('slide--up');
    activMenu?.classList.add('slide--down');

    setTimeout(() => {
      this.toggleOverlay();
    }, 500);

    activMenu?.classList.add('slide--up');
    this.selectedMenu = '';
  }

  // newChatSlideDown(){
  //   let menu: HTMLElement | null = document.getElementById('menuNewChat');
  //   menu?.classList.remove('slide--up');
  //   menu?.classList.add('slide--down');

  //   setTimeout(() => {
  //     this.toggleOverlay();
  //   }, 500);

  //   menu?.classList.add('slide--up');
  // }

  toggleOverlay() {
    const currentValue = this.showMenu.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenu.next(!currentValue);  // next change the negated value
  }
}
