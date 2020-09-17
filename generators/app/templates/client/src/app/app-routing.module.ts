import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { headerRoute } from './layouts/header/header.route';
import {errorRoutes} from './layouts/error/error.route';


const routes: Routes = [headerRoute, ...errorRoutes];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
