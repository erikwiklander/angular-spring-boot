import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(() => {
        // do nothing if ok
    },
    (err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
            const authService = this.inj.get(AuthService); // using this work around to prevent cyclic dependency
            authService.clearUser();
        }
    });
  }
}
