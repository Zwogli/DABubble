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

  constructor() { }

  menuSlideUp(){
    let menu: HTMLElement | null = document.getElementById('menu');
    menu?.classList.remove('slide--down');
    menu?.classList.add('slide--up');
    this.toggleMenu();
  }

  menuSlideDown(){
    let menu: HTMLElement | null = document.getElementById('menu');
    menu?.classList.remove('slide--up');
    menu?.classList.add('slide--down');

    setTimeout(() => {
      this.toggleMenu();
    }, 500);

    menu?.classList.add('slide--up');
  }

  toggleMenu() {
    const currentValue = this.showMenu.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenu.next(!currentValue);  // next change the negated value
  }
}
