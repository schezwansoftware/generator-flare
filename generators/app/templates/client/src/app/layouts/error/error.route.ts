import {Routes} from '@angular/router';
import {ErrorComponent} from './error.component';

export const errorRoutes: Routes = [
    {
        path: '404',
        component: ErrorComponent,
        data: {
           errorMessage: '404 Not Found'
        }
    },
    {
        path: '*',
        component: ErrorComponent,
        data: {
            errorMessage: '404 Not Found'
        }
    },
];
