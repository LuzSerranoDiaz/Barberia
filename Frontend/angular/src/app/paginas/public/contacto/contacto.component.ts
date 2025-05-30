import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ParallaxComponent } from "../../../components/parallax/parallax.component";

@Component({
  selector: 'app-contacto',
  imports: [FooterComponent, ParallaxComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

}
