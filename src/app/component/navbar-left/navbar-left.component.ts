import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.scss'],
})
export class NavbarLeftComponent {
  panelOpenState: boolean = false;

  rotateArrow(container: string) {
    const channelArrow: any = document.getElementById(
      `${container}--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
