import {
  Component,
  ElementRef,
  HostListener,
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
  avatarIsChoosen = false;
  public idFromUrl: any = '';
  userWillCloseWindow = false;

  @ViewChild('unchoosenAvatar') unchoosenAvatar!: ElementRef;

  constructor(
    public authService: AuthService,
    private fireStorage: AngularFireStorage,
    public firestoreService: FirestoreService,
    private Route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.getIdFromUrl();
    this.firestoreService.getJsonOfCurrentData('currentSignUpData', this.idFromUrl);
  }

  ngOnDestroy(): void {
    this.firestoreService.deleteCurrentData('currentSignUpData', this.idFromUrl);
    this.authService.errorUnexpected = false;
    this.authService.signUpError = false;
    this.authService.signUpSuccessfully = false;
    this.avatarIsChoosen = false;
  }

  async getIdFromUrl() {
    this.Route.params.subscribe((params) => {
      this.idFromUrl = params['id'];
    });
  }

  chooseAvatar(avatarNr: number) {
    this.unchoosenAvatar.nativeElement.src = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    this.choosenAvatar = `../../../../assets/img/avatars/avatar${avatarNr}.png`;
    this.avatarIsChoosen = true;
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `avatars/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.choosenAvatar = url;
      this.unchoosenAvatar.nativeElement.src = `${url}`;
      this.avatarIsChoosen = true;
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
      this.choosenAvatar,
      'sign-up',
      [],
      [],
    );
    setTimeout(() => {
      if (this.authService.signUpSuccessfully) {
        this.firestoreService.deleteCurrentData('currentSignUpData',this.idFromUrl);
      }
    }, 3500);
  }

  //Diese Funktion noch mal überprüfen, es funktioniert, aber löscht die coll auch bei aktualisieren der Seite
  //If the user closes the window or app, the collection currentSignUpData will be deleted automatically
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event:any) {
  //   this.firestoreService.deleteCurrentData('currentSignUpData', this.idFromUrl);
  // }
}
