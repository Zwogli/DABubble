import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
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
  errorAlreadyExist = false;
  currentUserId: string = '';


  constructor(public router: Router, public firestoreService: FirestoreService) {
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
        console.log('Auth getCurrentUser() if', user);
      } else {
        // User is signed out
        this.currentUserId = '';
        console.log('Auth getCurrentUser() else', user);
      }
    });
  }


  async signUp(name:string, email:string, password:string, photoUrl: any) {
      await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.signUpError = false;
        this.dataError = false;
        this.signUpSuccessfully = true;
        this.errorAlreadyExist = false;
        this.firestoreService.addUser(user, name, photoUrl);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.errorAlreadyExist = true;
          console.log('email existiert bereits', this.errorAlreadyExist);
        }
        this.signUpError = true;
        this.signUpSuccessfully = false;
        console.log(error.code);
      });
  }
}
