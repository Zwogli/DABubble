import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-panel-channels',
  templateUrl: './navbar-panel-channels.component.html',
  styleUrls: ['./navbar-panel-channels.component.scss']
})
export class NavbarPanelChannelsComponent {
  panelOpenState: boolean = false;

  rotateArrow() {
    const channelArrow: any = document.getElementById(
      `channel--arrow_drop_down`
    );
    channelArrow.classList.toggle('rotate');
  }
}
