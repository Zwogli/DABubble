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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  signUpError = false;
  signUpSuccessfully = false;
  public logInError = false;
  dataError = false;
  errorUnexpected = false;
  currentUserId: string = '';

  constructor(
    public router: Router,
    public firestoreService: FirestoreService
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


  async saveCurrentUserData(name: string, email: string, password: any) {
    await this.firestoreService.addCurrentSignUpData(name, email, password);
    this.router.navigate([`choose-avatar/${this.firestoreService.currentSignUpId}`]);
  }


  getCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.firestoreService.startSubUser(this.currentUserId);

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


  executeSignUp(userCredential: any, name: string, photoUrl: any) {
    this.signUpSuccessfully = true;
    setTimeout(() => {
      const user = userCredential.user;
      this.signUpError = false;
      this.dataError = false;
      this.firestoreService.addUser(user, name, photoUrl);
      this.router.navigate(['home']);
    }, 3500);
  }


  failedSignUp() {
    this.errorUnexpected = true;
    this.signUpError = true;
    this.signUpSuccessfully = false;
  }


  forgotPassword(email:string,) {
    const test = 'testVARIABLE';
    const actionCodeSettings = {
      url: `http://localhost:4200/sign-up-test{{test}}`,
    };


    sendPasswordResetEmail(this.auth, email, actionCodeSettings)
    .then(() => {
      console.log('EMAIL WAS SEND', email)
    })
    .catch((error) => {
      console.log('FEHLER', error.code)
    })
  }
}



