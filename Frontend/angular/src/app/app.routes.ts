import { Routes } from '@angular/router';
import { IndexComponent } from './paginas/public/index/index.component';
import { ContactoComponent } from './paginas/public/contacto/contacto.component';
import { EquipoComponent } from './paginas/public/equipo/equipo.component';
import { ServiciosComponent } from './paginas/public/servicios/servicios.component';
import { AcercaDeComponent } from './paginas/public/acerca-de/acerca-de.component';
import { LoginComponent } from './paginas/public/login/login.component';
import { LayoutComponent } from './paginas/public/layout/layout.component';
import { RegisterComponent } from './paginas/public/register/register.component';
import { AdminHomeComponent } from './paginas/private/admin-home/admin-home.component';
import { CustomerComponent } from './paginas/private/customer/customer.component';
import { EmployeeComponent } from './paginas/private/employee/employee.component';
import { CitasComponent } from './paginas/public/citas/citas.component';
//import { authGuard } from './components/paginas/private/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, //Ruta por defecto
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      //Aquí van las páginas que se podrán ver al estar loggeado.
      
      { path: 'inicio', component: IndexComponent },
      { path: 'equipo', component: EquipoComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'acercaDe', component: AcercaDeComponent },
      { path: 'citas', component: CitasComponent },
    ],
  },
  { path: 'admin', component: AdminHomeComponent, children: [
    { path: 'customer', component: CustomerComponent },
    { path: 'employee', component: EmployeeComponent },
  ] },
];
