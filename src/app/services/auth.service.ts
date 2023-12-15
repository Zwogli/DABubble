import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: any = getAuth();
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

  constructor(
    public router: Router,
    public firestoreService: FirestoreService,
    public afAuth: AngularFireAuth
  ) {
    this.getCurrentUser();
  }

  //////////sign-in
  signIn(email: string, password: string, location:string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.logInError = false;
        if (location == 'merge-accounts') {
          this.isLoggedInForMerging = true;
        } else {
          this.router.navigate(['home']);
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
    this.signIn('guest@mail.com', 'guest_user123', 'guest');
    this.router.navigate(['home']);
  }

  //////////google authentication
  async googleAuthentication() {
    const userCredential = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
    const user = userCredential.user;
    try {
      await this.firestoreService.checkSignUpEmail(user?.email);
      const userId = this.firestoreService.currentUserId;
      if (!this.firestoreService.emailAlreadyExist) {
        this.googleSignUp(user);
      } else {
        await this.firestoreService.checkIfGoogleAccount(userId);

        if (this.firestoreService.emailAlreadyExist && this.firestoreService.isGoogleAccount) {
          this.googleSignIn(user, userId);
        }
        if (this.firestoreService.emailAlreadyExist && !this.firestoreService.isGoogleAccount) {
          this.prepareAccountLinking(user);
        }
      }
    } catch {}
  }

  async googleSignUp(user:any) {
    this.googleAccount = true;
    await this.firestoreService.addUser(user, user?.displayName, user?.photoURL, this.googleAccount, [user?.uid], ['vIGUW5jmoxQQaKOf9AkD'], user?.uid);
    await this.firestoreService.addPrivateChat(user?.uid);
    this.router.navigate(['home']);
  }

  async googleSignIn(user:any, userId:any) {
    this.googleAccount = true;
    await this.firestoreService.getJsonOfCurrentData('user', userId);
    await this.firestoreService.addCurrentUserData();
    await this.firestoreService.addUser(user, this.firestoreService.currentUserData.name, this.firestoreService.currentUserData.photoUrl, this.googleAccount, this.firestoreService.currentUserData.activePrivateChats, this.firestoreService.currentUserData.memberInChannel, this.firestoreService.currentUserData.id);
    this.firestoreService.addPrivateChat(user?.uid);
    this.firestoreService.deleteCurrentData('currentUserData', this.firestoreService.currentUserData.id);
    this.router.navigate(['home']);
  }

  async prepareAccountLinking(user:any) {
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
        this.router.navigate(['home']);
      })
      .catch((error) => {
      });
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
      .catch((error) => {
      });
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
        console.log('Current User wurde geladen', user);
        await this.firestoreService.checkSignUpEmail(user?.email);
        this.currentUserId = this.firestoreService.currentUserId;
        this.firestoreService.startSubUser(this.currentUserId);
        localStorage.setItem('userId', this.currentUserId);
      } else {
        // User is signed out
        this.currentUserId = '';
      }
    });
  }

  //////////sign-up
  async signUp(name: string, email: string, password: string, photoUrl: any, location: string, activePrivateChats:any, memberInChannel: string[]) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.executeSignUp(userCredential, name, photoUrl, location, activePrivateChats, memberInChannel);
      })
      .catch((error) => {
        this.failedSignUp();
      });
  }

  async executeSignUp(userCredential: any, name: any, photoUrl: any, location: any, activePrivateChats:any, memberInChannel:[]) {
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
        this.router.navigate(['home']);
      }
      if (activePrivateChats == 0) {
        activePrivateChats = [user?.uid];
      }
      this.firestoreService.addUser(user, name, photoUrl, this.googleAccount, activePrivateChats, memberInChannel, docId);
      this.firestoreService.addPrivateChat(user.uid);
    }, 3500);
  }

  // async checkLocationToPrepareData(location:string, activePrivateChats:any, userId:any) {
  //   if (location == 'merge-accounts') {
  //     this.isLoggedInForMerging = true;
  //     this.googleAccount = true;
  //   } else {
  //     this.googleAccount = false;
  //     this.router.navigate(['home']);
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
}
