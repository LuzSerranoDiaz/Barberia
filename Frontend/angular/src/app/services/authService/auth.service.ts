import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = 'http://localhost:8001/login'; // Aquí va la url
  registerURL = 'http://localhost:8001/register';
  logoutURL = 'http://localhost:8001/logout';
  getUserURL= 'http://localhost:8001/getUser';

  router = inject(Router);
  http = inject(HttpClient);

  // Obtén el token CSRF
  getCsrfToken(): Observable<{ csrf_token: string }> {
    return this.http.get<{ csrf_token: string }>('http://localhost:8001/sanctum/csrf-cookie', {
      withCredentials: true // Necesario para que se envíen las cookies
    });
  }
  
  // Login
  login(credentials: { email: string; contrasena: string }): Observable<any> {
    return this.getCsrfToken().pipe(
      mergeMap((response) => {
        // Configura los encabezados para incluir el token CSRF
        const headers = new HttpHeaders({
          'X-CSRF-TOKEN': response.csrf_token,
          'Content-Type': 'application/json',
        });

        // Realiza la solicitud POST con el token CSRF
        return this.http.post(this.baseURL, credentials, {
          withCredentials: true, // Asegúrate de que las cookies sean enviadas
          headers: headers,
        });
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  logout(token : string): Observable<any> {
    return this.getCsrfToken().pipe(
      mergeMap((response) => {
        // Configura los encabezados para incluir el token CSRF
        const headers = new HttpHeaders({
          'X-CSRF-TOKEN': response.csrf_token,
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });

        // Realiza la solicitud POST con el token CSRF
        return this.http.post(this.logoutURL, null, {
          withCredentials: true, // Asegúrate de que las cookies sean enviadas
          headers: headers,
        });
      }),
      catchError((error) => {
        console.error('Error en el logout:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Registro
  register(credentials: { nombre: string, nombreUsuario: string, email: string, contrasena: string, contrasena_confirmation: string }): Observable<any> {
    return this.getCsrfToken().pipe(
      mergeMap((response) => {
        const headers = new HttpHeaders({
          'X-CSRF-TOKEN': response.csrf_token,
          'Content-Type': 'application/json',
        });

        console.log(credentials)

        return this.http.post(this.registerURL, credentials, {
          withCredentials: true,
          headers: headers,
        });
      }),
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  isAdmin(token : string): Observable<any>{
    return this.getCsrfToken().pipe(
      mergeMap((response) => {
        // Configura los encabezados para incluir el token CSRF
        const headers = new HttpHeaders({
          'X-CSRF-TOKEN': response.csrf_token,
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });

        // Realiza la solicitud POST con el token CSRF
        return this.http.get(this.getUserURL, {
          withCredentials: true, // Asegúrate de que las cookies sean enviadas
          headers: headers,
        });
      }),
      catchError((error) => {
        console.error('Error al getUser', error);
        return throwError(() => new Error(error));
      })
    );
  }
}