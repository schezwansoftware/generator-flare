import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AccountService} from '../../shared/auth/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    username: [''],
    password: [''],
    rememberMe: [true]
  });
  isAuthenticating = false;
  authenticationError = false;
  authenticationErrorMessage: string;

  constructor(private fb: FormBuilder, private accountService: AccountService, private route: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.isAuthenticating = true;
    this.authenticationError = false;
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    const rememberMe = false;
    this.accountService.login(username, password, rememberMe)
      .then(() => {
      this.isAuthenticating = false;
      this.route.navigate(['']);
    }).catch(error => {
      console.log(error);
      this.isAuthenticating = false;
      this.authenticationError = true;
      this.authenticationErrorMessage = error.error.message;
    });
  }

}
