import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'createoptions', title: 'Create Options',  icon: 'pe-7s-plus', class: '' },
    { path: 'user', title: 'User Profile',  icon:'pe-7s-user', class: '' },
    { path: 'activeoptions', title: 'Active Options',  icon:'pe-7s-note2', class: '' },
    { path: 'statistics', title: 'Statistics',  icon:'pe-7s-graph1', class: '' },
    { path: 'expiredoptions', title: 'Expired Options',  icon:'pe-7s-hourglass', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
