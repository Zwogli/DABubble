import { Component, ViewChild, ElementRef } from '@angular/core';
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
      Validators.pattern('^[a-zA-ZöÖüÜäÄß -]+$'),
    ]),
    emailForm: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    passwordForm: new FormControl('', [Validators.required, Validators.minLength(8),]),
    checkboxForm: new FormControl(),
  });

  constructor(public authService: AuthService) {}


  getCheckboxValue() {
    if (!this.checkboxForm?.value) {
      this.authService.checkboxIsChecked = true;
      this.authService.dataError = false;
    } else {
      this.authService.checkboxIsChecked = false;
      this.authService.dataError = true;
    }
  }

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

  /**
   * Get the password input field from the form group to use form control
   *
   */
  get checkboxForm() {
    return this.signUpForm.get('checkboxForm');
  }
}
