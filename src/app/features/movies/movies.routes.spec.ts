import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { provideAuth } from '../../auth/auth.provider';
import { AUTH_SERVICE } from '@thydda/auth-contracts';
import { Login } from '../../auth/login';

describe('Movies routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', component: Login }, ...routes]), provideAuth()],
    });
    TestBed.inject(AUTH_SERVICE).login('Ana');
  });

  it.each(['/dashboard', '/movies', '/movies/edit'])(
    'redirects signed-out users from %s to login',
    async (url) => {
      TestBed.inject(AUTH_SERVICE).logout();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(url);
      const router = TestBed.inject(Router);
      expect(router.parseUrl(router.url).queryParams['returnUrl']).toBe(url);
      expect(router.url).toContain('/login?');
      expect(harness.routeNativeElement?.querySelector('movie-search')).toBeNull();
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Demo sign in');
    },
  );

  it('returns to the requested page after standalone sign in', async () => {
    TestBed.inject(AUTH_SERVICE).logout();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/movies');
    const input = harness.routeNativeElement!.querySelector('input')!;
    input.value = 'Ana';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await harness.fixture.whenStable();
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/movies');
    expect(harness.routeNativeElement?.querySelector('movie-search')).not.toBeNull();
  });

  it('loads the list and search screen at /movies', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/movies');
    expect(TestBed.inject(Router).url).toBe('/movies');
    expect(harness.routeNativeElement?.querySelector('movie-search')).not.toBeNull();
  });

  it('loads the separate edit screen', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/movies/edit');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Edit movie');
    expect(harness.routeNativeElement?.querySelector('movie-search')).toBeNull();
  });

  it('navigates from the dashboard when Movies is clicked', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a');
    expect(link?.getAttribute('href')).toBe('/movies');
    link?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/movies');
    expect(harness.routeNativeElement?.querySelector('movie-search')).not.toBeNull();
  });
});
