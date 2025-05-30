import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientService } from '../../../services/clientService/client.service';
import { AuthService } from '../../../services/authService/auth.service';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule, FooterComponent, CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  private authService = inject(AuthService);
  private clientService = inject(ClientService);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private fb = inject(NonNullableFormBuilder); // Usamos NonNullableFormBuilder para garantizar que los valores nunca sean null o undefined.
  clientlist: any[] = [];
  updateArray: any[] = [];
  url = 'http://localhost:8001/customers';
  type = 'customer';
  

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

  filterForm = this.fb.group({
    nombre: ['', [Validators.maxLength(255)]],
    apellidos: ['', [Validators.maxLength(255)]],
    tlf: ['', [Validators.maxLength(255)]],
    DNI: ['', [Validators.maxLength(255)]],
    email: ['', [Validators.maxLength(255)]],
    pagina: ['1', [Validators.required]],
  });

  addForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    apellidos: ['', [Validators.required, Validators.maxLength(255)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(255)]],
    provincia: ['', [Validators.required, Validators.maxLength(255)]],
    municipio: ['', [Validators.required, Validators.maxLength(255)]],
    direccion: ['', [Validators.required, Validators.maxLength(255)]],
    tlf: ['', [Validators.required, Validators.maxLength(255)]],
    DNI: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    contrasena_confirmation: [
      '',
      [Validators.required, Validators.minLength(6)],
    ],
  });

  async ngOnInit() {
    await setTimeout(() => {
      this.loadClients(true);
    }, 200);
  }

  async loadClients(alertar?: boolean) {
    if (this.filterForm.valid) {
      let filterformValue = this.filterForm.value;
      let number: number = Number(filterformValue.pagina) * 10 - 10;

      const paramsObj = {
        nombre: filterformValue.nombre ? filterformValue.nombre : '',
        apellidos: filterformValue.apellidos ? filterformValue.apellidos : '',
        tlf: filterformValue.tlf ? filterformValue.tlf : '',
        DNI: filterformValue.DNI ? filterformValue.DNI : '',
        email: filterformValue.nombre ? filterformValue.nombre : '',
        skip: filterformValue.pagina ? number : '',
        take: 10,
      };
      let params = Object.values(paramsObj);

      this.clientService.get(this.type,this.url, params).subscribe({
        next: (res: any) => {
          var resultArray = Object.keys(res).map(function (personNamedIndex) {
            let cliente = res[personNamedIndex];
            return cliente;
          });
          this.clientlist = resultArray;
        },
        // en caso de que falle hace una llamada por defecto
        error: (err) => {
          this.clientService
            .get(this.type, this.url + '?take=10')
            .subscribe((res: any) => {
              if (!alertar) {
                // Para llamar al iniciar la pagina sin alerta
                alert('Clientes no encontrados');
              }
              this.clientlist = res;
            });
        },
      });
    } else {
      alert('Formulario inválido');
    }
  }

  delete(id: number) {
    this.clientService.delete(this.url, id).subscribe((res: any) => {
      //todo: hacer esto sin llamada, borrar elemento en front
      this.loadClients();
      alert(res.message);
    });
  }

  showUpdateForm(id: number) {
    this.renderer.setStyle(
      this.document.querySelector('#updateForm' + id),
      'display',
      ''
    );
  }

  async update(id: number) {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
      let clientObj = await firstValueFrom(
        this.clientService.getSingular(this.url, id)
      );
      let client = Object.values(Object.values(clientObj)[0]);

      const updateData = {
        nombre: formData.nombre ? formData.nombre : client[9],
        apellidos: formData.apellidos ? formData.apellidos : client[1],
        nombreUsuario: formData.nombreUsuario
          ? formData.nombreUsuario
          : client[10],
        provincia: formData.provincia ? formData.provincia : client[5],
        municipia: formData.municipio ? formData.municipio : client[4],
        direccion: formData.direccion ? formData.direccion : client[3],
        tlf: formData.tlf ? formData.tlf : client[2],
        DNI: formData.DNI ? formData.DNI : client[6],
        email: formData.email ? formData.email : client[7],
        contrasena: formData.contrasena ? formData.contrasena : client[8],
        contrasena_confirmation: formData.contrasena
          ? formData.contrasena
          : client[8],
      };

      this.clientService
        .update(this.url, id, updateData)
        .subscribe((res: any) => {
          this.loadClients();
        });

      this.renderer.setStyle(
        this.document.querySelector('#updateForm' + id),
        'display',
        'none'
      );
    } else {
      alert('Formulario inválido');
    }
  }

  add() {
    if (this.addForm.valid) {
      const formData = this.addForm.value;

      const registerData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        nombreUsuario: formData.nombreUsuario,
        provincia: formData.provincia,
        municipio: formData.municipio,
        direccion: formData.direccion,
        tlf: formData.tlf,
        DNI: formData.DNI,
        email: formData.email,
        contrasena: formData.contrasena,
        contrasena_confirmation: formData.contrasena,
      };

      this.clientService.add(this.url, registerData).subscribe((res: any) => {
        this.loadClients();
        console.log(res);
      });
    } else {
      alert('Formulario inválido');
    }
  }

}
