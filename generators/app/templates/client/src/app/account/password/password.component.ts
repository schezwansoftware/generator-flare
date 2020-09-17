import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../shared/auth/account.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  doNotMatch: string;
  error: string;
  success: string;
  account: any;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
  });
  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit() {
  }

  changePassword() {
    this.doNotMatch = null;
    const newPassword = this.passwordForm.get(['newPassword']).value;
    const currentPassword = this.passwordForm.get(['currentPassword']).value;
    if (newPassword !== this.passwordForm.get(['confirmPassword']).value) {
      this.error = null;
      this.success = null;
      this.doNotMatch = 'Passoword and Confirm Password must be same.';
    } else if (currentPassword === newPassword){
      this.doNotMatch = 'New Passoword and Old Password must not be same.';
    } else {
      this.accountService.changePassword(newPassword, currentPassword).subscribe(
          res => {
            console.log(res.body);
            this.error = null;
            this.success = 'OK';
          },
          error => {
            this.success = null;
            this.error = error.error.message;
          }
      )
    }
  }

}
