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

  toggleMenu() {
    const currentValue = this.showMenu.value; //behaviorSubject (complex object) you need showMenu.value for set init value
    this.showMenu.next(!currentValue);  // next change the negated value
  }
}
