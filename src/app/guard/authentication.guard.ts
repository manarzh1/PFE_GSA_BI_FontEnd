import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from 'rxjs';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isUserLoggedIn()) {
      return true;
    }
    
    // Redirect to the login page and notify the user
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`.toUpperCase());
    return false;
  }

  private isUserLoggedIn(): boolean {
    return (this.authenticationService.isUserLoggedIn());
  }
}

