import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Lietuvių šnekos sintezės demonstracija';

  copyrightDate(): number {
    return new Date().getFullYear();
  }
}
