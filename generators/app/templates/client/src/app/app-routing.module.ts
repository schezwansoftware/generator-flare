import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { headerRoute } from './layouts/header/header.route';


const routes: Routes = [headerRoute];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
