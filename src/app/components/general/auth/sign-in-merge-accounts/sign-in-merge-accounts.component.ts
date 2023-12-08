import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { FirestoreService } from '../../../../services/firestore.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-sign-in-merge-accounts',
  templateUrl: './sign-in-merge-accounts.component.html',
  styleUrls: ['./sign-in-merge-accounts.component.scss']
})
export class SignInMergeAccountsComponent implements OnDestroy, OnInit {
  public idFromUrl: any = '';


  signInForm = new FormGroup({
    // nameForm: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern('^[a-zA-ZöÖüÜäÄß -]+$'),
    // ]),
    // emailForm: new FormControl('', [
    //   Validators.required,
    //   Validators.email,
    //   Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    // ]),
    passwordForm: new FormControl('', [Validators.required]),
  });

  constructor(public authService: AuthService, public firestoreService: FirestoreService, private Route: ActivatedRoute) {}

  async ngOnInit() {
    await this.getIdFromUrl();
    await this.firestoreService.getJsonOfCurrentData('currentUserData', this.idFromUrl);
    console.log(this.firestoreService.currentUserData.email);
    console.log('test');
  }

  ngOnDestroy(): void {
    this.authService.isLoggedInForMerging = false;
  }

  prepareSignUp(name: string, email:string, password:string, location:string) {
    this.authService.signUp(name, email, password, this.firestoreService.currentUserData.photoUrl, location, this.firestoreService.currentUserData.activePrivateChats, this.firestoreService.currentUserData.memberInChannel);
  }

  async prepareAccountLinking() {
    await this.authService.linkAccounts();
    this.firestoreService.deleteCurrentData('currentUserData', this.firestoreService.currentUserData.id);
  }

  async getIdFromUrl() {
    this.Route.params.subscribe((params) => {
      this.idFromUrl = params['id'];
    });
  }

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get nameForm() {
    return this.signInForm.get('nameForm');
  }

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.signInForm.get('emailForm');
  }

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get passwordForm() {
    return this.signInForm.get('passwordForm');
  }
}
