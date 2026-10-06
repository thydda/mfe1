import { Component } from '@angular/core';

@Component({
  selector: 'app-movie-edit',
  template: `<section class="app-panel"><h1>Edit movie</h1></section>`,
  styles: `
    :host {
      display: block;
    }
    h1 {
      margin: 0;
    }
  `,
})
export class MovieEdit {}
