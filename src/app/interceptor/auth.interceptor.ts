import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Intercepter la requête vers l'endpoint de connexion
    if (request.url.includes(`${this.authenticationService.host}/user/login`)) {
      return next.handle(request);
    }
    
    // Intercepter la requête vers l'endpoint d'inscription
    if (request.url.includes(`${this.authenticationService.host}/user/register`)) {
      return next.handle(request);
    }


    // Si la requête ne correspond à aucun des endpoints ci-dessus, laisser passer la requête sans interception
    const handledRequest = next.handle(request);

    // Appel de la méthode loadToken à la fin de la méthode intercept
    this.authenticationService.loadToken();

   // Cloner la requête et ajouter l'en-tête d'authentification
   const token = this.authenticationService.getToken();
   if (token) {
     request = request.clone({
       setHeaders: {
         Authorization: `Bearer ${token}`
       }
     });
   }

   return next.handle(request);
  }
}
