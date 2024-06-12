import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  getLoggedInUsername(): string {
    return this.loggedInUsername;
  }
  public host = environment.apiUrl;
  private loggedInUsername: string = '';
  private jwtHelper = new JwtHelperService();
  private token: string = '';

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User> (`${this.host}/user/login`,user,{observe: 'response'});
  }

  public register(user: User): Observable<User > {
    return this.http.post<User>(
      `${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }
  

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public loadToken(): void {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token') || '';
    }
  }

  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    
    if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      if (decodedToken && decodedToken.sub) {
        this.loggedInUsername = decodedToken.sub;
        return true;
      }
    }
    
    return false;
  }

  public isUserLoggedIn(): boolean {
    return this.isLoggedIn(); // Utilisation de la méthode isLoggedIn() pour vérifier si l'utilisateur est connecté
  }



 
}
