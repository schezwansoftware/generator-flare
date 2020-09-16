import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {SharedModule} from '../shared/shared.module';
import {LOGIN_ROUTE} from './login/login.route';
import {RouterModule} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { REGISTER_ROUTE } from './register/register.route';
import { ActivateComponent } from './activate/activate.component';
import {ACTIVATE_ROUTE} from './activate/activate.route';
import {PASSWORD_RESET_FINISH_ROUTE} from './password-reset/finish/password-reset-finish.route';
import {PASSWORD_RESET_INIT_ROUTE} from './password-reset/init/password-reset-init.route';
import {PasswordResetFinishComponent} from './password-reset/finish/password-reset-finish.component';
import {PasswordResetInitComponent} from './password-reset/init/password-reset-init.component';
import { SettingsComponent } from './settings/settings.component';
import {SETTINGS_ROUTE} from './settings/settings.route';
import { PasswordComponent } from './password/password.component';
import {PASSWORD_ROUTE} from './password/password.route';

export const accountRoutes = [
  LOGIN_ROUTE,
  REGISTER_ROUTE, ACTIVATE_ROUTE,
  PASSWORD_RESET_FINISH_ROUTE,
  PASSWORD_RESET_INIT_ROUTE,
  SETTINGS_ROUTE, PASSWORD_ROUTE,
  PASSWORD_ROUTE,
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ActivateComponent, PasswordResetInitComponent, PasswordResetFinishComponent, SettingsComponent, PasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(accountRoutes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
