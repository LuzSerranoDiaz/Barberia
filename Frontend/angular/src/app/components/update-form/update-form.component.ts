import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';
import { ClientService } from '../../services/clientService/client.service';

@Component({
  selector: 'app-update-form',
  imports: [ReactiveFormsModule],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css',
})
export class UpdateFormComponent {
  clientService = inject(ClientService);
  private fb = inject(NonNullableFormBuilder); // Usamos NonNullableFormBuilder para garantizar que los valores nunca sean null o undefined.
  updateForm = this.fb.group({
    nombre: ['', [Validators.maxLength(255)]],
    apellidos: ['', [Validators.maxLength(255)]],
    nombreUsuario: ['', [Validators.maxLength(255)]],
    provincia: ['', [Validators.maxLength(255)]],
    municipio: ['', [Validators.maxLength(255)]],
    direccion: ['', [Validators.maxLength(255)]],
    tlf: ['', [Validators.maxLength(255)]],
    DNI: ['', [Validators.maxLength(255)]],
    email: ['', [Validators.email]],
    contrasena: ['', [Validators.minLength(6)]],
  });
  formId = input<number>();
  
  update(id: number) {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
      let client;
      this.clientService.getClient(id).subscribe((res : any) => { client = res });

      console.log(client)

      const updateData = {
        nombre: formData.nombre ? formData.nombre : null,
        apellidos: formData.apellidos ? formData.apellidos : null,
        nombreUsuario: formData.nombreUsuario ? formData.nombreUsuario : null,
        provincia: formData.provincia ? formData.provincia : null,
        municipia: formData.municipio ? formData.municipio : null,
        direccion: formData.direccion ? formData.direccion : null,
        tlf: formData.tlf ? formData.tlf : null,
        DNI: formData.DNI ? formData.DNI : null,
        email: formData.email ? formData.email : null,
        contrasena: formData.contrasena ? formData.contrasena : null,
      };
    } else {
      console.log('Formulario inválido');
    }
  }
}
