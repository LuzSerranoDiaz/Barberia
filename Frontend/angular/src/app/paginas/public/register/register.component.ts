import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder); // Usamos NonNullableFormBuilder para garantizar que los valores nunca sean null o undefined.
  private authService = inject(AuthService); // Inyectamos AuthService
  private router = inject(Router);

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    contrasena_confirmation: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Formulario enviado:', formData);
      // Hacemos una verificación de que las propiedades no son undefined
      const registroData = {
        nombre: formData.nombre!,
        nombreUsuario: formData.nombreUsuario!,
        email: formData.email!,
        contrasena: formData.contrasena!,
        contrasena_confirmation: formData.contrasena_confirmation!,
      };

      this.authService
        .register(registroData)
        .pipe(
          catchError((error) => {
            console.error('Error al registrar un usuario', error);
            return throwError(() => new Error(error));
          })
        )
        .subscribe(
          (response) => {
            localStorage.setItem('authToken', response.access_token);
            console.log('Usuario registrado exitosamente', response);
            this.router.navigate(['/']);
            
          },
          (error) => {
            console.error('Error al registrar usuario:', error);
          }
        );
    } else {
      console.log('Formulario inválido');
    }
  }
}
