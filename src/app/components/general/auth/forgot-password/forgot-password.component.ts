import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(public authService: AuthService) {}


  forgotPasswordForm = new FormGroup({
    emailForm: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._*/+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
  });


  /**
   * Get the email input field from the form group to use form control
   *
   */
  get emailForm() {
    return this.forgotPasswordForm.get('emailForm');
  }
}
