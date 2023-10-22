import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-panel-message',
  templateUrl: './navbar-panel-message.component.html',
  styleUrls: ['./navbar-panel-message.component.scss']
})
export class NavbarPanelMessageComponent {
  panelOpenState: boolean = false;

  rotateArrow(container: string) {
    const channelArrow: any = document.getElementById(
      `${container}--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
