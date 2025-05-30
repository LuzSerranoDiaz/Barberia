import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

}
