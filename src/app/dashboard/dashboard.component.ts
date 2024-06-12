import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  public user!: User;

  constructor(private  authenticationService: AuthenticationService, private router: Router , private notifier: NotificationService){}
  ngOnInit(): void {
   this.user = this.authenticationService.getUserFromLocalCache()
  }

  onLogOut(): void {
    // Appel de la méthode de déconnexion du service d'authentification
    this.authenticationService.logOut();

    // Redirection vers la page de connexion
    this.router.navigate(['/login']);

    // Affichage de la notification de déconnexion réussie
    this.notifier.notify(NotificationType.SUCCESS, "You've been successfully logged out");
  }
  

}
