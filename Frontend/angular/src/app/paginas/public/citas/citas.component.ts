import { Component, inject } from '@angular/core';
import { ParallaxComponent } from '../../../components/parallax/parallax.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ClientService } from '../../../services/clientService/client.service';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthService } from '../../../services/authService/auth.service';

@Component({
  selector: 'app-citas',
  imports: [
    FooterComponent,
    ParallaxComponent,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent {
  clientService = inject(ClientService);
  authService = inject(AuthService);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);
  private fb = inject(NonNullableFormBuilder);
  employeeUrl = 'http://localhost:8001/employees';
  servicesUrl = 'http://localhost:8001/services';
  customerUserUrl = 'http://localhost:8001/customersUser';
  appointmentUrl = 'http://localhost:8001/appointments';
  employeeList: any[] = [];
  serviceList: any[] = [];
  /* expanded = false; */
  dropdownList: any[] = [];
  dropdownSettings = {};
  servicios: any = [];

  constructor(private formBuilder: FormBuilder) {}

  addForm = this.fb.group({
    empleados: ['', [Validators.required]],
    servicios: [[], [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  async ngOnInit() {
    let tmp = [];
    await setTimeout(async () => {
      await this.clientService.get('employee', this.employeeUrl).subscribe({
        next: (res: any) => {
          this.employeeList = res;
        },
      });
      await this.clientService.get('employee', this.servicesUrl).subscribe({
        next: (res: any) => {
          for (let i = 0; i < res.length; i++) {
            tmp.push({ item_id: res[i].id, item_text: res[i].nombre });
            this.dropdownList = tmp;
          }
        },
      });
      this.serviceList.forEach((e) => {
        var id = e.id;
        var name = e.nombre;
        this.dropdownList.push({ id, name });
      });
    }, 500);

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  async addAppointment() {
    if (this.addForm.valid) {
      const formData = this.addForm.value;
      let usr: any;
      let customer: any;
      let contract: any;
      let serviciosArray: any[] = [];
      this.servicios = formData.servicios;

      for (let i = 0; i < this.servicios.length; i++) {
        serviciosArray.push(this.servicios[i].item_id)
      }

      this.authService
        .isAdmin(localStorage.getItem('authToken') || '')
        .subscribe((res: any) => {
          usr = res.user.id;
        });

      setTimeout(() => {
        this.clientService
          .getSingular(this.customerUserUrl, usr)
          .subscribe((res: any) => {
            customer = res[0].id;
          });
      }, 400);

      setTimeout(() => {
        this.clientService
          .getSingularContract('http://localhost:8001', customer)
          .subscribe((res: any) => {
            contract = res[0].id;
          });
      
        
      }, 800);

       setTimeout(() => {
        const registerData = {
          contrato_id: contract,
          cliente_id: customer,
          empleado_id: formData.empleados,
          arrayServicios: serviciosArray,
          fecha: formData.fecha,
          estado: 'pendiente',
          numero_de_atenciones: serviciosArray.length,
        };

        console.log(formData);
        console.log(registerData);
        this.clientService.add(this.appointmentUrl, registerData).subscribe((res : any) => {
          console.log(res)
        })
       }, 1200);
    } else {
      alert('Formulario inválido');
    }
  }

  /*   showCheckboxes() {
    var checkboxes = this.document.querySelector('#checkboxes');
    if (!this.expanded) {
      this.renderer.setStyle(checkboxes, 'display', 'block');
      this.expanded = true;
    } else {
      this.renderer.setStyle(checkboxes, 'display', '');
      this.expanded = false;
    }
  } */
}
