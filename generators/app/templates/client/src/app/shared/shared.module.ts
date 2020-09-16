import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {PasswordStrengthBarModule} from 'ng2-password-strength-bar';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    PasswordStrengthBarModule
  ],
  exports: [NgbModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, HttpClientModule, PasswordStrengthBarModule]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule
    };
  }
}
