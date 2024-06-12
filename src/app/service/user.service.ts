
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({providedIn: 'root'})
export class UserService {
  getUserFromLocalCache(): User[] {
    throw new Error('Method not implemented.');
  }
  private host= environment.apiUrl;
  getUsersFromToLocalCache: any;
  updateuser: any;

  constructor(private http : HttpClient ) {}


  public getLoggedInUser(): User | null {
    const users = this.getUsersFromLocalCache();
    return users.length > 0 ? users[0] : null;
  }

  public getUsers(): Observable<User[] >{
    return this.http.get<User[]>(`${this.host}/user/list`);

  }

  public addUser(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.host}/user/add`, formData);

  }

  public updateUser(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.host}/user/update`, formData);

  }

  public resetPassword(email: string): Observable<CustomHttpRespone > {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);

  }
  public requestPasswordReset(email: string): Observable<CustomHttpRespone> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/requestPasswordReset`, { email });
  }

  public updatePassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    const url = `${this.host}/user/updatePassword`;
    const body = new FormData();
    body.append('token', token);
    body.append('newPassword', newPassword);
    body.append('confirmPassword', confirmPassword);
    return this.http.post(url, body);
  }

  
  public updateProfileImage(formData: FormData): Observable<HttpEvent <User>>{
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpRespone >{
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }


  public getUsersToLocalCache(): User[] {
    const usersString: string | null = localStorage.getItem('users');
    if (usersString !== null) {
      return JSON.parse(usersString);
    }
    return [];
  }
  public getUsersFromLocalCache(): User[] {
    const usersString: string | null = localStorage.getItem('users');
    if (usersString !== null) {
      return JSON.parse(usersString);
    }
    return []; // Return an empty array if no users are found in the local cache
  }

  
  public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData{
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);  
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;

    
  }

}
