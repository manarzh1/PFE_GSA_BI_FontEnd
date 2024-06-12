import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset-component.component.html',
  styleUrls: ['./request-password-reset-component.component.css']
})
export class RequestPasswordResetComponent implements OnInit {
  public showLoading: boolean | null = false;
  public email: string = '';

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {}

  public onRequestPasswordReset(): void {
    this.showLoading = true;
    this.userService.requestPasswordReset(this.email).subscribe(
      response => {
        this.showLoading = false;
        this.sendNotification(NotificationType.SUCCESS, 'Reset password email sent successfully.');
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
}
