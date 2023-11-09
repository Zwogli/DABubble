import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent implements OnInit, OnDestroy {
  choosenAvatar: any = 0;
  public idFromUrl: any = '';

  @ViewChild('unchoosenAvatar') unchoosenAvatar!: ElementRef;

  constructor(
    public authService: AuthService,
    private fireStorage: AngularFireStorage,
    public firestoreService: FirestoreService,
    private Route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.getIdFromUrl();
    this.firestoreService.getJsonOfCurrentSignUpData(this.idFromUrl);
  }

  ngOnDestroy(): void {
    this.firestoreService.deleteCurrentSignUpData(this.idFromUrl);
    this.authService.errorUnexpected = false;
    this.authService.signUpError = false;
    this,this.authService.signUpSuccessfully = false;
    console.log('deleted doc');
  }

  async getIdFromUrl() {
    this.Route.params.subscribe((params) => {
      this.idFromUrl = params['id'];
    });
  }

  chooseAvatar(avatarNr: number) {
    this.unchoosenAvatar.nativeElement.src = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    this.choosenAvatar = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    console.log(this.choosenAvatar);
  }

  async onFileChange(event: any) {
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


  async prepareChoosenAvatar() {
    if (this.choosenAvatar == 0) {
      this.choosenAvatar = '../../../../assets/img/avatars/guest-avatar.png';
    }
  }

  async prepareSignUp() {
    await this.prepareChoosenAvatar();
    await this.authService.signUp(
      this.firestoreService.currentSignUpData.name,
      this.firestoreService.currentSignUpData.email,
      this.firestoreService.currentSignUpData.password,
      this.choosenAvatar
    );
    setTimeout(() => {
      if (this.authService.signUpSuccessfully) {
        this.firestoreService.deleteCurrentSignUpData(this.idFromUrl);
      }
    },3500)

  }
}
