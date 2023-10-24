import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  currentUserId = '';
  public logInError = false;

  constructor(public router: Router) {}

  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.logInError = false;
        this.router.navigate(['home']);
        console.log('Eingeloggter User:', user);
        this.getCurrentUser();
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        this.logInError = true;
      });
  }


  guestSignIn() {
    this.currentUserId = 'QyqQVfCO6HMj2jcNN2YKTAFhGz62'; //currentUserId get's the id from guest user
    this.router.navigate(['home']);
    console.log('guest userid:', this.currentUserId);
  }


  getCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        console.log('currentUserUID:', this.currentUserId);
      } else {
        // User is signed out
        this.currentUserId = '';
      }
    });
  }
}
