import {Route} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {FlareRouteGuard} from '../../shared/auth/auth.guard';

export const SETTINGS_ROUTE: Route = {
    path: 'settings',
    data: {
        authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [FlareRouteGuard],
    component: SettingsComponent
};
