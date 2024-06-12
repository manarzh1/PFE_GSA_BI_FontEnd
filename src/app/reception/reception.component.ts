import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.userName = this.authService.getLoggedInUsername();
  }
}
