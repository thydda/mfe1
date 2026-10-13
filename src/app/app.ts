import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AUTH_SERVICE, type AuthService } from '@thydda/auth-contracts';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  template: `
    <header class="app-header">
      <div class="app-header-inner">
        <a class="app-brand" routerLink="/dashboard">Library</a>
        @if (auth.user()) {
          <nav class="app-nav" aria-label="Main navigation">
            <a
              class="app-nav-link"
              routerLink="/dashboard"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              >Home</a
            >
            <a
              class="app-nav-link"
              routerLink="/movies"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              >Movies</a
            >
          </nav>
        }
        @if (auth.user(); as user) {
          <span>Signed in as {{ user.name }}</span>
          <button class="btn btn-outline-light" type="button" (click)="auth.logout()">
            Sign out
          </button>
        }
      </div>
    </header>
    <main class="app-main"><router-outlet /></main>
  `,
})
export class App {
  protected readonly auth = inject<AuthService>(AUTH_SERVICE);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.user() && this.router.navigated && !this.router.url.startsWith('/login')) {
        void this.router.navigateByUrl('/login', { replaceUrl: true }).catch(console.error);
      }
    });
  }
}
