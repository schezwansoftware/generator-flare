import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../shared/auth/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed: boolean;

  constructor(private accountService: AccountService, private route: Router) {
    this.isNavbarCollapsed = true;
  }

  ngOnInit() {
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.accountService.logout();
    this.route.navigate(['/']);
  }
}
