import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent {
  choosenAvatar:any = 0;

  @ViewChild('unchoosenAvatar') unchoosenAvatar!: ElementRef;

  constructor(public authService: AuthService) {}

  chooseAvatar(avatarNr: number) {
    this.unchoosenAvatar.nativeElement.src = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    this.choosenAvatar = avatarNr;
    console.log(this.choosenAvatar);
  }
}
