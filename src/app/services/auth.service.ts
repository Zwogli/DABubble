import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider, signOut } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  signUpError = false;
  signUpSuccessfully = false;
  emailSended = false;
  sendMailError = false;
  public logInError = false;
  dataError = false;
  errorUnexpected = false;
  currentUserId: string = '';

  constructor(
    public router: Router,
    public firestoreService: FirestoreService,
    public afAuth: AngularFireAuth
  ) {
    this.getCurrentUser();
  }

  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.logInError = false;
        this.router.navigate(['home']);
      })
      .catch((error) => {
        this.logInError = true;
      });
  }


  guestSignIn() {
    this.signIn('guest@mail.com', 'guest_user123');
    this.router.navigate(['home']);
  }


  googleSignIn() {
    this.afAuth.signInWithPopup(new GoogleAuthProvider())
    .then((userCredential) => {
      const user = userCredential.user;
      this.firestoreService.addUser(user, user?.displayName, user?.photoURL);
      this.router.navigate(['home']);
    });
  }


  signOut() {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      this.currentUserId = '';
      localStorage.removeItem('userId');
    }).catch((error) => {
      // An error happened.
    });
  }


  async saveCurrentUserData(name: string, email: string, password: any) {
    await this.firestoreService.addCurrentSignUpData(name, email, password);
    this.router.navigate([`choose-avatar/${this.firestoreService.currentSignUpId}`]);
  }


  getCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.firestoreService.startSubUser(this.currentUserId);
        localStorage.setItem('userId', this.currentUserId);
      } else {
        // User is signed out
        this.currentUserId = '';
      }
    });
  }


  async signUp(name: string, email: string, password: string, photoUrl: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.executeSignUp(userCredential, name, photoUrl);
      })
      .catch((error) => {
        this.failedSignUp();
      });
  }


  executeSignUp(userCredential: any, name: any, photoUrl: any) {
    this.signUpSuccessfully = true;
    setTimeout(() => {
      const user = userCredential.user;
      this.signUpError = false;
      this.dataError = false;
      this.firestoreService.addUser(user, name, photoUrl);
      this.firestoreService.addPrivateChat(user.uid);
      this.router.navigate(['home']);
    }, 3500);
  }


  failedSignUp() {
    this.errorUnexpected = true;
    this.signUpError = true;
    this.signUpSuccessfully = false;
  }


  async forgotPassword(email:string,) {
    sendPasswordResetEmail(this.auth, email)
    .then(() => {
      this.emailSended = true;
      this.firestoreService.emailAlreadyExist = false;
      setTimeout(() => {
        this.emailSended = false;
      }, 4000)
    })
    .catch((error) => {
      this.sendMailError = true;
    })
  }
}



