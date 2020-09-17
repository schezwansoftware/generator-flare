import {Route} from '@angular/router';
import {PasswordComponent} from './password.component';
import {FlareRouteGuard} from '../../shared/auth/auth.guard';

export const PASSWORD_ROUTE: Route = {
    path: 'password',
    data: {
        authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [FlareRouteGuard],
    component: PasswordComponent,
};
