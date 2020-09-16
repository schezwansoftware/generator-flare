import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('authenticationToken') || sessionStorage.getItem('authenticationToken') || null;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        }
      });
    }
    return next.handle(request);
  }
}
