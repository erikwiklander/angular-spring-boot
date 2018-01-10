import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { GenericTableComponent } from './generic-table/generic-table.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/customer', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customer', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'customer/:id', component: CustomerEditComponent, canActivate: [AuthGuard] },
  { path: 'customer/reg', component: CustomerEditComponent, canActivate: [AuthGuard] },
  { path: 'employee', component: GenericTableComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: '/customer' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule { }
