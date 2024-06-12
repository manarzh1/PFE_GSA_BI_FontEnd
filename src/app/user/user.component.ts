import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription} from 'rxjs';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';
import { SubSink } from 'subsink';
import { finished } from 'node:stream';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private currentUsername!: string;
  public users: User[] = [];
  public user!: User;
  public refreshing!: boolean;
  private subscriptions: Subscription[] = [];
  public fileName: string | null = null;
  public profileImage: File | null = null;
  public editUser = new User();
  public emailAddress: any;
  public fileStatus = new FileUploadStatus();
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleActions$ = this.titleSubject.asObservable();
  public selectedUser?: User;

  
  
  constructor( private router: Router ,private authenticationService: AuthenticationService,
    private userService: UserService, private notifier: NotificationService){}

  ngOnInit() {
    this.user = this.authenticationService.getUserFromLocalCache();
    if(!this.userService.getUsersFromLocalCache()){
      this.getUsers(true);
    }else{
     this.users = this.userService.getUserFromLocalCache();
  }
  }

  public changeTitle(title: string): void{
    this.titleSubject.next(title);
  }



  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getUsers().subscribe(
        (response: User[] ) => {
            this.userService.addUsersToLocalCache(response);
            this.users = response;
            this.refreshing = false;
            if (showNotification) {
              this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`);
            }
          },
          (error: HttpErrorResponse)=>{
            this.sendNotification(NotificationType.ERROR, error.error.message);
            this.refreshing = false;
          }
        ));
      }


    public onSelectUser(selectedUser: User): void {
        this.selectedUser = selectedUser;
        setTimeout(() => {
            document.getElementById('openUserInfo')?.click();
        }, 0);
    }
    




public saveNewUser(): void{
  document.getElementById('new-user-save')?.click();
 }
 
 public onAddNewUser(userForm: NgForm): void {
  const formData = this.userService.createUserFormDate('', userForm.value, this.profileImage!);
  this.subs.add(
    this.userService.addUser(formData).subscribe(
      (response: User) => {
        document.getElementById('new-user-close')?.click();
        this.getUsers(false);
        this.fileName = '';
        this.profileImage = null;
        userForm.reset();
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully. Please check your email for the password.`);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
        this.fileName = null;
      }
    )
  );
}

public onUpdateUser(): void {
  const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage!);
  this.subs.add( 
    this.userService.updateUser(formData).subscribe(
      (response: User ) => {
          document.getElementById('closeEditUserModalButton')?.click();
          this.getUsers(false);
          this.fileName = '';
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName}  ${response.lastName} update successfully`);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
        this.fileName = null;
      }
    )
  );
}


public onUpdateCurrentUser(currentUserForm: NgForm): void {
  this.refreshing = true;
  this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
  const formData = this.userService.createUserFormDate(this.currentUsername, currentUserForm.value, this.profileImage!);
  this.subs.add(
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        console.log(response);
        this.authenticationService.addUserToLocalCache(response);
        this.getUsers(false);
        this.fileName = '';
        this.refreshing = false;
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
        this.refreshing = false;
      }
    )
  );
}

public onProfileImageChange(event: any): void {
  const files = event?.target?.files;
  if (files && files.length > 0) {
    const selectedFile = files[0];
    // Ajoutez ici le traitement que vous souhaitez effectuer avec le fichier sélectionné
    // Par exemple, vous pouvez stocker le fichier dans une propriété de la classe pour une utilisation ultérieure
    this.profileImage = selectedFile;
    this.fileName = selectedFile.name;
  }
}




public onUpdateProfileImage():void{
  const formData = new FormData();
  formData.append('username', this.user.username);
  formData.append('profileImage', this.profileImage!);
  this.subscriptions.push(
    this.userService.updateProfileImage(formData).subscribe(
      (event: HttpEvent <any> ) => {
          this.reportUploadProgress(event);
        },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.fileStatus.status = 'done';
      }
    )
    );
}



public updateProfileImage(): void{
  document.getElementById('profile-image-input')?.click();
}



  private reportUploadProgress(event: HttpEvent<any>): void {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      this.fileStatus.percentage = Math.round(100 * event.loaded / event.total!);
      this.fileStatus.status = 'progress';
      break;
    case HttpEventType.Response:
      if (event.status === 200) {
        this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
        this.notifier.notify(NotificationType.SUCCESS, `${event.body.firstName}'s profile image updated successfully`);
        this.fileStatus.status = 'done';
        break;
      } else {
        this.notifier.notify(NotificationType.WARNING, 'Unable to upload image. Please try again');
      break;
      }
    default:
     console.log('finished upload: ${event.type}.');
  }
}




public onLogOut(): void{
  this.authenticationService.logOut();
  this.router.navigate(['/login']);
  this.sendNotification(NotificationType.SUCCESS,`You've been successfully logged out`);
}



public onResetPassword(emailForm: NgForm): void {
  this.refreshing = true;
  const emailAddress = emailForm.value['reset-password-email'];
  this.subscriptions.push(
    this.userService.resetPassword(emailAddress).subscribe(
      (response: CustomHttpRespone ) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.WARNING, error.error.message);
        this.refreshing = false;
      },
      () => emailForm.reset()
    )
  );
}


public onDeleteUder(username: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete the user ${username}? This process cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result: { isConfirmed: any; }) => {
    if (result.isConfirmed) {
      this.subs.add(
        this.userService.deleteUser(username).subscribe(
          (response: CustomHttpRespone) => {
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getUsers(false);
            this.selectedUser = undefined; // Clear selected user after deletion
          },
          (error: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, error.error.message);
          }
        )
      );
    }
  });
}
  


public onEditUser(editUser: User): void {
  this.editUser = editUser;
  this.currentUsername = editUser.username;
  setTimeout(() => {
    document.getElementById('openUserEdit')?.click();
  }, 0);
}

 
 

public searchUsers(searchTerm: string): void{
  const results: User[] = [];
  for (const user of this.userService.getUsersFromLocalCache()){
    if(user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
       user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
       user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
       user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ){
        results.push(user);
       }
  }
  this.users = results;
  if (results.length === 0 || !searchTerm ){
    this.users = this.userService.getUsersFromLocalCache();
  }

}


public get isAdmin(): boolean{
  return this.getUserRole() === Role.ADMIN ;
}

public get isUser(): boolean {
  return this.getUserRole() === Role.USER;
}

private getUserRole(): string{
  return this.authenticationService.getUserFromLocalCache().role;
}

public goToUserProfile(): void {
  this.router.navigate(['/profile']); // Adjust the route as per your application
}

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  private clickButton(buttonId : string): void {
    document.getElementById(buttonId)?.click();
  }

  ngOnDestroy(): void { 
    this.subs.unsubscribe();
  }

 
}
