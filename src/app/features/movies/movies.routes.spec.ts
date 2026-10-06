import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('Movies routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
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
