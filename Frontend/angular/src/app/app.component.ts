import { Component } from '@angular/core';
import { provideRouter, RouterLink, RouterOutlet} from '@angular/router';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular';
}
