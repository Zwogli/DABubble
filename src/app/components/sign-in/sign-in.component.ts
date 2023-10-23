import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

  signInForm = new FormGroup({
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    passwordForm: new FormControl('', [Validators.required]),
  });

  constructor(public authService: AuthService) { }


  /**
   * Get the name input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.signInForm.get('emailForm');
  }

  /**
   * Get the name input field from the form group to use form control
   *
   */
  get passwordForm() {
    return this.signInForm.get('passwordForm');
  }
}
