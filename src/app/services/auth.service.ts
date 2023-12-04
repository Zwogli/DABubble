import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  linkWithCredential,
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

  signIn(email: string, password: string, location:string) {
    console.log(email, password);
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.logInError = false;
        if (location == 'merge-accounts') {
          this.isLoggedInForMerging = true;
        } else {
          this.router.navigate(['home']);
        }

      })
      .catch((error) => {
        this.logInError = true;
        console.log(error.code);
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

  async googleSignIn() {
    const userCredential = await this.afAuth.signInWithPopup(
      new GoogleAuthProvider()
    );
    const user = userCredential.user;

    try {
      await this.firestoreService.checkSignUpEmail(user?.email);
      if (!this.firestoreService.emailAlreadyExist) {
        this.googleAccount = true;
        this.firestoreService.addUser(user, user?.displayName, user?.photoURL, this.googleAccount);
        this.router.navigate(['home']);
        console.log('KEIN EXISTIERENDER USER')
      } else {
        await this.firestoreService.checkIfGoogleAccount(user?.uid);
        console.log(user?.uid)
        console.log(this.firestoreService.isGoogleAccount);
        if (this.firestoreService.emailAlreadyExist && this.firestoreService.isGoogleAccount) {
          this.googleAccount = true;
          this.firestoreService.addUser(user, user?.displayName, user?.photoURL, this.googleAccount);
          this.router.navigate(['home']);
          console.log('EXISTIERT UND GOOGLE ACCOUNT');
        }
        if (this.firestoreService.emailAlreadyExist && !this.firestoreService.isGoogleAccount) {
          user?.delete();
          this.afAuth.signOut();
          console.log('WEITERLEITUNG COMPONENT');
          console.log('EXISTIERT UND NORMALER ACCOUNT');
          this.router.navigate(['sign-in-merge-accounts']);

          //accounts zusammenführen
        }
      }
    } catch {}
  }

  linkAccounts() {
    const provider = new GoogleAuthProvider();

    linkWithPopup(this.auth.currentUser, provider)
      .then((result) => {
        // Accounts successfully linked.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        this.router.navigate(['home']);
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        // Handle Errors here.
        // ...
      });
  }

  // async googleSignIn() {
  //   await this.afAuth.signInWithPopup(new GoogleAuthProvider())
  //   .then((userCredential) => {
  //     const user = userCredential.user;
  //     this.firestoreService.checkSignUpEmail(user?.email);

  //     if (this.firestoreService.emailAlreadyExist) {
  //       // Benutzerkonto verknüpfen
  //       const existingUser = this.getExistingUserCredentials(user?.email, 'password');
  //       console.log(existingUser);
  //       this.linkEmailPasswordWithGoogle(existingUser, user);
  //     } else {
  //       // Neuen Benutzer registrieren (falls nicht vorhanden)
  //       this.firestoreService.addUser(user, user?.displayName, user?.photoURL);
  //     }

  //     this.router.navigate(['home']);
  //     console.log(this.firestoreService.emailAlreadyExist);
  //   });
  // }

  // async googleSignIn() {
  //   try {
  //     const userCredential = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
  //     const user = userCredential.user;
  //     console.log(user?.email);

  //     console.log('vor der funnktion', this.firestoreService.emailAlreadyExist);
  //     await this.firestoreService.checkSignUpEmail(user?.email);
  //     console.log('nach der funnktion', this.firestoreService.emailAlreadyExist);

  //     // if (this.firestoreService.emailAlreadyExist) {
  //     //   // Benutzerkonto verknüpfen
  //     //   const existingUser = await this.getExistingUserCredentials(user?.email, 'password');
  //     //   console.log(existingUser);
  //     //   console.log('if abfrage true');
  //     //   await this.linkEmailPasswordWithGoogle(existingUser, user);
  //     // } else {
  //     //   // Neuen Benutzer registrieren (falls nicht vorhanden)
  //     //   await this.firestoreService.addUser(user, user?.displayName, user?.photoURL);
  //     //   console.log('if abfrage false');
  //     // }
  //     this.getExistingUserCredentials(user?.email, 'password');
  //     // console.log(existingUser);
  //     // await this.linkEmailPasswordWithGoogle(existingUser, user);
  //     this.router.navigate(['home']);
  //   } catch (error) {
  //     console.error('Fehler bei der Google-Anmeldung:', error);
  //   }
  // }

  linkEmailPasswordWithGoogle(emailPasswordUser: any, googleUser: any) {
    const googleCredential = googleUser.credential;
    console.log(googleCredential);

    return emailPasswordUser
      .linkWithCredential(googleCredential)
      .then((linkedUserCredential: any) => {
        const linkedUser = linkedUserCredential.user;
        console.log('Konten erfolgreich verknüpft:', linkedUser);
        // Hier kannst du zusätzliche Aktionen ausführen, wenn die Konten erfolgreich verknüpft wurden
      });
  }

  signOut() {
    signOut(this.auth)
      .then(() => {
        // Sign-out successful.
        this.currentUserId = '';
        localStorage.removeItem('userId');
        this.router.navigateByUrl('');
        console.log('IS LOGGED OUT');
      })
      .catch((error) => {
        // An error happened.
      });
  }

  async saveCurrentUserData(name: string, email: string, password: any) {
    await this.firestoreService.addCurrentSignUpData(name, email, password);
    this.router.navigate([
      `choose-avatar/${this.firestoreService.currentSignUpId}`,
    ]);
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
      this.googleAccount = false;
      this.firestoreService.addUser(user, name, photoUrl, this.googleAccount);
      this.firestoreService.addPrivateChat(user.uid);
      this.router.navigate(['home']);
    }, 3500);
  }

  failedSignUp() {
    this.errorUnexpected = true;
    this.signUpError = true;
    this.signUpSuccessfully = false;
  }

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
