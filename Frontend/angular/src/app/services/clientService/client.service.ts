import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder); // Usamos NonNullableFormBuilder para garantizar que los valores nunca sean null o undefined.
  private router = inject(Router);
  //headers
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.authService.getCsrfToken().subscribe((res: any) => {
      this.headers = new HttpHeaders({
        'X-CSRF-TOKEN': res.csrf_token,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      });
    });
  }

  get(callType: string, url: string, parameters?: Array<any>) {
    let fullURL;

    switch (callType) {
      case 'customer':
        if (parameters) {
          fullURL = `${url}?nombre=${parameters[0]}&apellidos=${parameters[1]}&tlf=${parameters[2]}&DNI=${parameters[3]}&skip=${parameters[5]}&take=10`;
        } else {
          fullURL = url;
        }
        return this.http.get(fullURL, {
          headers: this.headers,
        });
        break;

      case 'employee':
        if (parameters) {
          fullURL = `${url}?nombre=${parameters[0]}&apellidos=${parameters[1]}&tlf=${parameters[2]}&DNI=${parameters[3]}&skip=${parameters[5]}&take=10`;
        } else {
          fullURL = url;
        }
        return this.http.get(fullURL, {
          headers: this.headers,
        });
        break;

      default:
        break;
    }

    return this.http.get(`${url}?take=10`, {
      headers: this.headers,
    });
  }

  getSingular(url: string, id: number) {
    return this.http.get(url + '/' + id, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getSingularContract(url: string, id: number) {
    return this.http.get(url + '/' + id + '/contracts', {
      headers: this.headers,
      withCredentials: true,
    });
  }

  delete(url: string, id: number) {
    return this.http.delete(url + '/' + id, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  update(url: string, id: number, updateData: Object) {
    console.log(updateData);

    return this.http.put(url + '/' + id, updateData, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  add(url: string, addData: Object) {
    console.log(addData);

    return this.http.post(url, addData, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
