import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export class AuthService {
  auth = getAuth();

  signIn(email:string, password:string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('Eingeloggter User:', user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
}
