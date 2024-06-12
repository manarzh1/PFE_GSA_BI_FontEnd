import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-modifpassword',
  templateUrl: './modifpassword.component.html',
  styleUrls: ['./modifpassword.component.css']
})
export class ModifpasswordComponent implements OnInit {
  public showLoading: boolean | null = false;
  public token: string | null = null;
  public newPassword: string = '';
  public confirmPassword: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  public onUpdatePassword(): void {
    if (!this.token) {
      this.sendNotification(NotificationType.ERROR, 'Token is missing');
      return;
    }

    this.showLoading = true;
    this.userService.updatePassword(this.token, this.newPassword, this.confirmPassword).subscribe(
      response => {
        this.showLoading = false;
        this.sendNotification(NotificationType.SUCCESS, 'Password updated successfully.');
        this.router.navigate(['/login']);
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
