import { AuthService } from './../auth/auth.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  username: string;
  opened = true;
  mode = 'side';
  mediaWatcher: Subscription;
  navWatcher: Subscription;
  authWatcher: Subscription;

  links = [
      { label: 'Customers', link: '/customer' },
      { label: 'Employees', link: '/employee' }
     ];

  constructor(private media: ObservableMedia, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.opened = false;
    this.username = this.authService.username;

    this.authWatcher = this.authService.authChanged.subscribe(
      (username: string) => this.username = username);

    // if screen is small hide the navigation
    this.mediaWatcher = this.media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.opened = false;
        this.mode = 'over';
      } else {
        this.opened = this.isAuthenticated();
        this.mode = 'side';
      }
    });

    this.navWatcher = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.mode === 'over') {
          this.opened = false;
        } else {
          this.opened = this.isAuthenticated();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
    this.navWatcher.unsubscribe();
    this.authWatcher.unsubscribe();
  }

  isAuthenticated(): boolean {
    return this.username != null;
  }

  onLogoutClick(): void {
    this.authService.logout();
  }

}
