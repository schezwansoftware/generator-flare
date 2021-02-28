import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { HeaderComponent } from './layouts/header/header.component';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft, faAsterisk,
  faBan, faBars, faBell, faBook, faCalendarAlt, faCloud,
  faEye, faFlag, faHdd, faHeart, faHome, faList, faLock, faPencilAlt,
  faPlus, faRoad, fas,
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
    FontAwesomeModule,
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


  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faUser);
    library.addIcons(faSort);
    library.addIcons(faSortUp);
    library.addIcons(faSortDown);
    library.addIcons(faSync);
    library.addIcons(faEye);
    library.addIcons(faBan);
    library.addIcons(faTimes);
    library.addIcons(faArrowLeft);
    library.addIcons(faSave);
    library.addIcons(faPlus);
    library.addIcons(faPencilAlt);
    library.addIcons(faBars);
    library.addIcons(faHome);
    library.addIcons(faThList);
    library.addIcons(faUserPlus);
    library.addIcons(faRoad);
    library.addIcons(faTachometerAlt);
    library.addIcons(faHeart);
    library.addIcons(faList);
    library.addIcons(faBell);
    library.addIcons(faTasks);
    library.addIcons(faBook);
    library.addIcons(faHdd);
    library.addIcons(faFlag);
    library.addIcons(faWrench);
    library.addIcons(faLock);
    library.addIcons(faCloud);
    library.addIcons(faSignOutAlt);
    library.addIcons(faSignInAlt);
    library.addIcons(faCalendarAlt);
    library.addIcons(faSearch);
    library.addIcons(faTrashAlt);
    library.addIcons(faAsterisk);
  }
}
