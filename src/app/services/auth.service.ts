import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  signUpError = false;
  public logInError = false;
  currentUserId = '';
  currentUser:any = [];
  currentUserSubject = new BehaviorSubject<any>(
    this.currentUser
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(public router: Router, public firestoreService: FirestoreService) {}


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
        this.currentUser.push(user);
        console.log('currentUserUID:', this.currentUserId);
        console.log('observable:', this.currentUser$);
      } else {
        // User is signed out
        this.currentUserId = '';
      }
    });
  }


  signUp(name:string, email:string, password:string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log('neuer user:', user);
        this.signUpError = false;
        this.firestoreService.addUser(user, name);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        this.signUpError = true;
      });
  }
}
