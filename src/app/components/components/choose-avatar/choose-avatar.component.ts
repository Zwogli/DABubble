import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent {
  choosenAvatar:any = 0;

  @ViewChild('unchoosenAvatar') unchoosenAvatar!: ElementRef;

  constructor(public authService: AuthService, private fireStorage: AngularFireStorage) {}


  chooseAvatar(avatarNr: number) {
    this.unchoosenAvatar.nativeElement.src = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    this.choosenAvatar = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    console.log(this.choosenAvatar);
    console.log('current user data:', this.authService.currentUserName);
  }


  async onFileChange(event:any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      const path = `avatars/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('download url', url);
      this.choosenAvatar = url;
      console.log(this.choosenAvatar);
      this.unchoosenAvatar.nativeElement.src = `${url}`;

    }
  }
}
