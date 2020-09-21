import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { HeaderComponent } from './layouts/header/header.component';
import { SharedModule } from './shared/shared.module';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft, faAsterisk,
  faBan, faBars, faBell, faBook, faCalendarAlt, faCloud,
  faEye, faFlag, faHdd, faHeart, faHome, faList, faLock, faPencilAlt,
  faPlus, faRoad,
  faSave, faSearch, faSignInAlt, faSignOutAlt,
  faSort,
  faSortDown,
  faSortUp,
  faSync, faTachometerAlt, faTasks, faThList,
  faTimes, faTrashAlt,
  faUser, faUserPlus, faWrench
} from '@fortawesome/free-solid-svg-icons';
import {AccountModule} from './account/account.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './shared/auth/auth.interceptor';
import { ErrorComponent } from './layouts/error/error.component';
import {EntityModule} from './entity/entity.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    SharedModule.forRoot(),
    EntityModule,
    AccountModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {


  constructor() {
    library.add(faUser);
    library.add(faSort);
    library.add(faSortUp);
    library.add(faSortDown);
    library.add(faSync);
    library.add(faEye);
    library.add(faBan);
    library.add(faTimes);
    library.add(faArrowLeft);
    library.add(faSave);
    library.add(faPlus);
    library.add(faPencilAlt);
    library.add(faBars);
    library.add(faHome);
    library.add(faThList);
    library.add(faUserPlus);
    library.add(faRoad);
    library.add(faTachometerAlt);
    library.add(faHeart);
    library.add(faList);
    library.add(faBell);
    library.add(faTasks);
    library.add(faBook);
    library.add(faHdd);
    library.add(faFlag);
    library.add(faWrench);
    library.add(faLock);
    library.add(faCloud);
    library.add(faSignOutAlt);
    library.add(faSignInAlt);
    library.add(faCalendarAlt);
    library.add(faSearch);
    library.add(faTrashAlt);
    library.add(faAsterisk);
  }
}
