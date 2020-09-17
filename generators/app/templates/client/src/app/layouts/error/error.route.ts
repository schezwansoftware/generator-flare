import {Routes} from '@angular/router';
import {ErrorComponent} from './error.component';

export const errorRoutes: Routes = [
    {
        path: '404',
        component: ErrorComponent,
        data: {
           title: '404 Not Found',
           errorMessage: 'The requested resource doesn\'t exist',
        }
    },
    {
        path: 'accessdenied',
        component: ErrorComponent,
        data: {
            title: '403 Forbidden',
            errorMessage: 'You don\'t have permission to access this resource.',
        }
    },
    {
        path: '*',
        component: ErrorComponent,
        data: {
            title: '404 Not Found',
            errorMessage: 'The requested resource doesn\'t exist',
        }
    },
];
