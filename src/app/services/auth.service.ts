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
  public logInError = false;
  checkboxIsChecked = false;
  dataError = false;
  currentUserId: string = '';
  currentUserName: string = '';
  currentUserEmail: string = '';
  currentUserPassword: string = '';


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


  saveCurrentUserData(name: string, email: string, password: any) {
    this.currentUserName = name;
    this.currentUserEmail = email;
    this.currentUserPassword = password;
    // let signUpData = {
    //   name: name,
    //   email: email,
    //   password: password
    // }
    this.firestoreService.addCurrentSignUpData(name, email, password);
    this.router.navigate(['choose-avatar']);
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


  signUp(name:string, email:string, password:string, photoUrl: any) {
    // if (this.checkboxIsChecked) {
      createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        this.signUpError = false;
        this.dataError = false;
        this.firestoreService.addUser(user, name, photoUrl);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        this.signUpError = true;
        console.log(error);
      });
    // } else {
    //   this.dataError = true;
    //   console.log('not checked problem');
    // }
  }
}
