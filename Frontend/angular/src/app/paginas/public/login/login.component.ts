import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    email: '',
    contrasena: '',
  };

  router = inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Formulario enviado:', formData);
      // Hacemos una verificación de que las propiedades no son undefined
      const registroData = {
        email: formData.email!,
        contrasena: formData.contrasena!,
      };

      this.authService.login(registroData).subscribe(
        (response) => {
          localStorage.setItem('authToken', response.token);
          console.log('login exitoso', response);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error en el login:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
