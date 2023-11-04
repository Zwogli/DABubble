import { Injectable, inject } from '@angular/core';
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


  constructor(public router: Router, public firestoreService: FirestoreService) {
    this.getCurrentUser();
  }


  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.logInError = false;
        this.router.navigate(['home']);
        // ...
      })
      .catch((error) => {
        this.logInError = true;
      });
  }


  guestSignIn() {
    this.currentUserId = 'KmnG9Gk8urcE10vX3n4p0uc40mA2'; //currentUserId get's the id from guest user
    this.router.navigate(['home']);
    console.log('guest userid:', this.currentUserId);
  }


  getCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        const userId = user.uid;
        localStorage.setItem('currentUserId', user.uid);
        this.firestoreService.startSubUser(this.currentUserId);
        // console.log('Auth getCurrentUser() if', user);
        
      } else {
        // User is signed out
        this.currentUserId = '';
        // console.log('Auth getCurrentUser() else', user);    
      }
    });
  }


  signUp(name:string, email:string, password:string) {
    if (this.checkboxIsChecked) {
      createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        this.signUpError = false;
        this.dataError = false;
        this.firestoreService.addUser(user, name);
        this.router.navigate(['home']);        
      })
      .catch((error) => {
        this.signUpError = true;
      });
    } else {
      this.dataError = true;
    }
  }
}
