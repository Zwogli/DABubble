import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, signOut, linkWithPopup } from '@angular/fire/auth';
import { ResponsiveService } from './responsive.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: any = getAuth();
  rs: ResponsiveService = inject(ResponsiveService);

  signUpError = false;
  signUpSuccessfully = false;
  emailSended = false;
  sendMailError = false;
  public logInError = false;
  dataError = false;
  errorUnexpected = false;
  currentUserId: string = '';
  googleAccount = false;
  isLoggedInForMerging = false;
  public isLoggedIn: boolean = false;
  private defaultChannel: string = '82C9Qh2AsibAiC6Ehti2';

  constructor(
    public router: Router,
    public firestoreService: FirestoreService,
    public afAuth: AngularFireAuth
  ) {
    this.getCurrentUser();
  }

  //////////sign-in
  signIn(email: string, password: string, location: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.logInError = false;
        if (location == 'merge-accounts') {
          this.isLoggedInForMerging = true;
        } else {
          this.redirectToLandingPage();
        }
      })
      .catch((error) => {
        this.logInError = true;
      });
  }

  async getExistingUserCredentials(email: any, password: string) {
    signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        console.log(userCredential);
      }
    );
  }

  guestSignIn() {
    this.signIn('guest@mail.com', 'guest_User123', 'guest');

    this.redirectToLandingPage();
  }

  //////////google authentication
  async googleAuthentication() {
    const userCredential = await this.afAuth.signInWithPopup(
      new GoogleAuthProvider()
    );
    const user = userCredential.user;
    try {
      await this.firestoreService.checkSignUpEmail(user?.email);
      const userId = this.firestoreService.currentUserId;
      if (!this.firestoreService.emailAlreadyExist) {
        this.googleSignUp(user);
      } else {
        await this.firestoreService.checkIfGoogleAccount(userId);

        if (
          this.firestoreService.emailAlreadyExist &&
          this.firestoreService.isGoogleAccount
        ) {
          this.googleSignIn(user, userId);
        }
        if (
          this.firestoreService.emailAlreadyExist &&
          !this.firestoreService.isGoogleAccount
        ) {
          this.prepareAccountLinking(user);
        }
      }
    } catch {}
  }

  async googleSignUp(user: any) {
    this.googleAccount = true;
    await this.firestoreService.addUser(
      user,
      user?.displayName,
      user?.photoURL,
      this.googleAccount,
      [user?.uid],
      [this.defaultChannel],
      user?.uid
    );
    await this.firestoreService.addPrivateChat(user?.uid);
    await this.firestoreService.updateChannelMember(user?.uid);

    this.redirectToLandingPage();
  }

  async googleSignIn(user: any, userId: any) {
    this.googleAccount = true;
    await this.firestoreService.getJsonOfCurrentData('user', userId);
    await this.firestoreService.addCurrentUserData();
    await this.firestoreService.addUser(
      user,
      this.firestoreService.currentUserData.name,
      this.firestoreService.currentUserData.photoUrl,
      this.googleAccount,
      this.firestoreService.currentUserData.activePrivateChats,
      this.firestoreService.currentUserData.memberInChannel,
      this.firestoreService.currentUserData.id
    );
    this.firestoreService.deleteCurrentData(
      'currentUserData',
      this.firestoreService.currentUserData.id
    );
    this.redirectToLandingPage();
  }

  async prepareAccountLinking(user: any) {
    await this.firestoreService.getJsonOfCurrentData('user', user?.uid);
    this.afAuth.signOut();
    await user?.delete();
    await this.firestoreService.deleteUser(user?.uid);
    await this.firestoreService.addCurrentUserData();
    this.router.navigate([`sign-in-merge-accounts/${user?.uid}`]);
  }

  async linkAccounts() {
    const provider = new GoogleAuthProvider();

    linkWithPopup(this.auth.currentUser, provider)
      .then((result) => {
        // Accounts successfully linked
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;

        this.redirectToLandingPage();
      })
      .catch((error) => {});
  }

  //////////sign-out
  signOut() {
    signOut(this.auth)
      .then(() => {
        // Sign-out successful.
        this.currentUserId = '';
        localStorage.removeItem('userId');
        this.router.navigateByUrl('');
      })
      .catch((error) => {});
  }

  //////////data preparing
  async saveCurrentUserData(name: string, email: string, password: any) {
    await this.firestoreService.addCurrentSignUpData(name, email, password);
    this.router.navigate([
      `choose-avatar/${this.firestoreService.currentSignUpId}`,
    ]);
  }

  getCurrentUser() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.firestoreService.checkSignUpEmail(user?.email);
        this.currentUserId = this.firestoreService.currentUserId;
        this.firestoreService.startSubUser(this.currentUserId);
        this.firestoreService.setOnlineStatus(this.currentUserId, 'online');
        localStorage.setItem('userId', this.currentUserId);
        this.isLoggedIn = true;
      } else {
        // User is signed out
        this.currentUserId = '';
        this.isLoggedIn = false;
        const docId = localStorage.getItem('userId');
        this.firestoreService.setOnlineStatus(docId, 'offline');
      }
    });
  }

  //////////sign-up
  async signUp(
    name: string,
    email: string,
    password: string,
    photoUrl: any,
    location: string,
    activePrivateChats: any,
    memberInChannel: string[]
  ) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.executeSignUp(
          userCredential,
          name,
          photoUrl,
          location,
          activePrivateChats,
          memberInChannel
        );
      })
      .catch((error) => {
        this.failedSignUp();
      });
  }

  async executeSignUp(
    userCredential: any,
    name: any,
    photoUrl: any,
    location: any,
    activePrivateChats: any,
    memberInChannel: string[]
  ) {
    this.signUpSuccessfully = true;
    setTimeout(() => {
      const user = userCredential.user;
      let docId = '';
      this.signUpError = false;
      this.dataError = false;
      //this.checkLocationToPrepareData(location, activePrivateChats, user?.uid);
      if (location == 'merge-accounts') {
        this.isLoggedInForMerging = true;
        this.googleAccount = true;
        docId = this.firestoreService.currentUserData.id;
      } else {
        this.googleAccount = false;
        docId = user?.uid;
        this.firestoreService.updateChannelMember(docId);

        this.redirectToLandingPage();
      }
      if (activePrivateChats == 0) {
        activePrivateChats = [user?.uid];
      }
      this.firestoreService.addUser(
        user,
        name,
        photoUrl,
        this.googleAccount,
        activePrivateChats,
        memberInChannel,
        docId
      );
      this.firestoreService.addPrivateChat(user.uid);
    }, 3500);
  }

  // async checkLocationToPrepareData(location:string, activePrivateChats:any, userId:any) {
  //   if (location == 'merge-accounts') {
  //     this.isLoggedInForMerging = true;
  //     this.googleAccount = true;
  //   } else {
  //     this.googleAccount = false;
  //     this.redirectToLandingPage();
  //   }
  //   if (activePrivateChats == 0) {
  //     activePrivateChats = [userId];
  //   }
  // }

  failedSignUp() {
    this.errorUnexpected = true;
    this.signUpError = true;
    this.signUpSuccessfully = false;
  }

  //////////forgot password
  async forgotPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.emailSended = true;
        this.firestoreService.emailAlreadyExist = false;
        setTimeout(() => {
          this.emailSended = false;
        }, 4000);
      })
      .catch((error) => {
        this.sendMailError = true;
      });
  }

  redirectToLandingPage() {
    this.rs.isDesktop$.pipe(take(1)).subscribe((val) => {
      if (val) {
        this.router.navigateByUrl(
          `/home(channel:chat/channel)?channelID=${this.defaultChannel}`
        );
      } else {
        this.router.navigate(['home']);
      }
    });
  }
}
