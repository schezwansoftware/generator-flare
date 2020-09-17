import {Component, OnInit} from '@angular/core';
import {AccountService} from './shared/auth/account.service';
import {NavigationError, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountService.identity(true);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationError) {
        this.router.navigate(['/404']);
      }
    });
  }

}
