import { Component, OnInit } from '@angular/core';
import { Menu } from './menu';
import {Router} from '@angular/router'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  public menuProperties: Array<Menu> = [
    {
      id: '1',
      titre:'Reception',
      icon:'fas fa-home',
      url:'user/management',
      sousMenu: [] // Add an empty array for consistency
    },
    {
    id: '2',
    titre:'dashboard',
    icon:'fas fa-chart-line',
    url:'',
    sousMenu: [
      {
        id: '11',
        titre: 'stock dashboard',
        icon: 'fas fa-chart-pie',
        url: 'stockdachboard'
      }, 
      {
        id: '12',
        titre: 'purchase dachboard',
        icon: 'fas fa-chart-bar',
        url: 'purchasedachboard'
      }
    ]
  },
  {
    id:'3',
    titre:'Access',
    icon:'fas fa-users',
    url:'',
    sousMenu: [
      {
        id: '21',
        titre: 'Users',
        icon: 'fas fa-user',
        url: 'user'
      }
    ]
  }
  
];
navigate: any;

constructor(
  private router: Router
){ }

ngOnInit():void{  
}
navidate(url?: string): void{
  this.router.navigate([url]);
}
}
