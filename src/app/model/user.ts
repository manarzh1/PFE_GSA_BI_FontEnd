export class User {
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public logInDateDisplay: Date;
  public joinDate: Date;
  public profileImageUrl: string;
  public active: boolean;
  public notLocked: boolean;
  public role: string;
  public authorities: any[];

  constructor() {
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.lastLoginDate = new Date(); // Default to the current date and time
    this.lastLoginDateDisplay = new Date(); // Default to the current date and time
    this.logInDateDisplay = new Date(); // Default to the current date and time
    this.joinDate = new Date(); // Default to the current date and time
    this.profileImageUrl = '';
    this.active = false;
    this.notLocked = false;
    this.role = '';
    this.authorities = [];
  }
}