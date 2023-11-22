import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  /** helpfull trick to create observable boolean */
  showMenuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) // behaviorSubject near a observable
  showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();  // change behaviorSubject -> observable
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

  menuSlideDown(){
    let activMenu: HTMLElement | null = document.getElementById(this.selectedMenu);
    setTimeout(() => {
      this.toggleOverlay();
    }, 250);
    activMenu?.classList.remove('slide--up');
    activMenu?.classList.add('slide--down');

    activMenu?.classList.add('slide--up');
    this.selectedMenu = '';
  }

  toggleOverlay() {
    const currentValue = this.showMenuSubject.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenuSubject.next(!currentValue);  // next change the negated value
  }
}
