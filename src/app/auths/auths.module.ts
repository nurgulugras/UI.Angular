import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '.';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthsComponent } from './auths.component';
import { AuthsRoutingModule } from './auths-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DirectivesModule } from '../shared/directives/directives.module';

const MODULES = [
  CommonModule,
  NgxLoadingModule.forRoot({}),
  AuthsRoutingModule,
  DirectivesModule,
  ModalModule.forRoot(),
  FormsModule,
  ReactiveFormsModule,
]
const COMPONENTS = [
  AuthsComponent,
  LoginComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS]
})
export class AuthsModule { }
