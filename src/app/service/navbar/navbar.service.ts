import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  showMenu: boolean = false

  constructor() { }

  toggleMenu() {
    return this.showMenu = !this.showMenu;
  }
}
