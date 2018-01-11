import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NavigationComponent } from './navigation/navigation.component';

import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { AppRoutingModule } from './/app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerService } from './customer/customer.service';
import { HighlightPipe } from './highlight.pipe';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CustomerListComponent,
    LoginComponent,
    CustomerEditComponent,
    HighlightPipe,
    GenericTableComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ScrollDispatchModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    CustomerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
