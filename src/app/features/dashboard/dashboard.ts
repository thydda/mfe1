import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <section class="app-panel dashboard">
      <p class="app-eyebrow">Your collection</p>
      <h1>A good movie starts here.</h1>
      <p class="app-description">
        Explore the collection, discover a favourite and find your next movie.
      </p>
      <a class="btn btn-primary app-button" routerLink="/movies">Movies</a>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .dashboard {
      padding-block: clamp(2rem, 8vw, 5rem);
    }
    h1 {
      max-inline-size: 16ch;
    }
  `,
})
export class Dashboard {}
