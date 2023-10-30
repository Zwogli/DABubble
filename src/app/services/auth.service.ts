import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
  collectionData,
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  signUpError = false;
  public logInError = false;
  checkboxIsChecked = false;
  dataError = false;

  allUser$:any;
  unsubCurrentUser:any;

  currentUserId:any;
  currentUser:any = [];
  currentUserSubject = new BehaviorSubject<any>(
    this.currentUser
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(public router: Router, public firestoreService: FirestoreService) {
    this.allUser$ = collectionData(this.getAllUser());
  }


  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.logInError = false;
        this.router.navigate(['home']);
        this.getCurrentUser();
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

  getAllUser() {
    return collection(this.firestore, 'user');
  }


  getCurrentUserRef(docId: string) {
    return doc(collection(this.firestore, 'user'), docId);
  }


  getCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // this.currentUserId = user.uid;
        // this.currentUser.push(user);
        const userId = user.uid;
        //this.getCurrentUserTest(userId);
        this.firestoreService.giveUserIdToService(userId);
        localStorage.setItem('currentUserId', user.uid);
      } else {
        // User is signed out
        this.currentUserId = '';
      }
    });
  }


  getCurrentUserTest(docId: string) {
    onSnapshot(this.getCurrentUserRef(docId), (element) => {
      console.log(element.data());
    })
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
