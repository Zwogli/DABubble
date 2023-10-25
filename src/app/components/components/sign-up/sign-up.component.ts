import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    nameForm: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZöÖüÜäÄß ]+$'),
    ]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    passwordForm: new FormControl('', [Validators.required]),
  });

  constructor(public authService: AuthService) {}

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get nameForm() {
    return this.signUpForm.get('nameForm');
  }

  /**
   * Get the email input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.signUpForm.get('emailForm');
  }

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get passwordForm() {
    return this.signUpForm.get('passwordForm');
  }
}
