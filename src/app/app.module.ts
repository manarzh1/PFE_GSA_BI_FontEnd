import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { NotificationService } from './service/notification.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReceptionComponent } from './reception/reception.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './composants/menu/menu.component';
import { purchasedachboardComponent } from './purchasedachboard/purchasedachboard.component';
import { StockdashboardComponent } from './stockdashboard/stockdashboard.component';
import { ModifpasswordComponent } from './modifpassword/modifpassword.component';
import { RequestPasswordResetComponent } from './request-password-reset-component/request-password-reset-component.component'; // Assurez-vous que ce chemin est correct

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    DashboardComponent,
    MenuComponent,
    ReceptionComponent,
    purchasedachboardComponent,
    StockdashboardComponent,
    ModifpasswordComponent,
    RequestPasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule
  ],
  providers: [
    UserService,
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
