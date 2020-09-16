import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../shared/auth/account.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-password-reset-finish',
  templateUrl: './password-reset-finish.component.html',
  styleUrls: ['./password-reset-finish.component.scss']
})
export class PasswordResetFinishComponent implements OnInit {

  resetKey: string;
  doNotMatch: string;
  error: string;
  keyMissing: boolean;
  success: string;

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
  });

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService, private fb: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetKey = params.key;
      this.keyMissing = !this.resetKey;
    });
  }

  finishReset() {
    this.doNotMatch = null;
    this.error = null;
    const password = this.passwordForm.get(['newPassword']).value;
    const confirmPassword = this.passwordForm.get(['confirmPassword']).value;
    if (password !== confirmPassword) {
      this.doNotMatch = 'ERROR';
    } else {
      this.accountService.passwordResetFinish({ resetKey: this.resetKey, newPassword: password }).subscribe(
          () => {
            this.success = 'OK';
          },
          error => {
            this.success = null;
            this.error = error.error.message;
          }
      );
    }
  }

}
