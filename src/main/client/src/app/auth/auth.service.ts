import { Principal } from './../model/principal.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
 import 'rxjs/add/observable/of';
 import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  authChanged = new Subject<string>();
  username: string;

  constructor(private router: Router, private http: HttpClient) { }

  public isAuthenticated(): Observable<boolean> {
    if (this.username != null) {
      return Observable.of(true);
    } else {
      return this.http.get<Principal>('/api/user').map(e => {
        this.username = e.username;
        this.authChanged.next(e.username);
        return true;
      }).catch(() => {
        return Observable.of(false);
      });
    }
  }

  public login() {
    this.http.get<Principal>('/api/user', {
      headers: {Authorization: 'Basic ' + btoa('admin:admin')}
    }).subscribe(data => {
      this.username = data.username;
      this.authChanged.next(data.username);
      this.router.navigate(['/']);
    }, (errorResponse: HttpErrorResponse) => console.log('error!', errorResponse));
  }

  public logout() {
    this.http.get('/logout').subscribe(() => this.clearUser());
  }

  public clearUser() {
    this.username = null;
    this.authChanged.next(null);
    this.router.navigate(['/login']);
  }

}
