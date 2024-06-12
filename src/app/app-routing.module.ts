import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { purchasedachboardComponent } from './purchasedachboard/purchasedachboard.component';
import { StockdashboardComponent } from './stockdashboard/stockdashboard.component';
import { ReceptionComponent } from './reception/reception.component';
import { ModifpasswordComponent } from './modifpassword/modifpassword.component';
import { RequestPasswordResetComponent } from './request-password-reset-component/request-password-reset-component.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'modifpassword', component: ModifpasswordComponent }, // This route is not protected by the guard
  { path: 'request-password-reset', component: RequestPasswordResetComponent }, // New route for password reset request
  { path: 'reset-password', component: ModifpasswordComponent }, // Route for resetting the password with token

  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'user/management', component: ReceptionComponent, canActivate: [AuthenticationGuard] },
      { path: 'purchasedachboard', component: purchasedachboardComponent },
      { path: 'stockdachboard', component: StockdashboardComponent },
      { path: 'user', component: UserComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
