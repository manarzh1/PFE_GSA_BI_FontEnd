import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { HeaderType } from '../enum/header-type.enum';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  showLoading: boolean|null = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.redirectUser();
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN) || '';
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body || {} as User);
          this.router.navigateByUrl('user/management');
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error.message === "Account is inactive. Please contact the administrator.") {
            this.sendErrorNotification(NotificationType.ERROR, "Your account is inactive. Please contact the administrator.");
          } else {
            this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          }
          this.showLoading = false;
        }
      )
    );
  }

  private redirectUser(): void {
    const user = this.authenticationService.getUserFromLocalCache();
    if (user.role === 'ROLE_USER') {
      this.router.navigateByUrl('/profile');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
