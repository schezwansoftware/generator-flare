import {Component, OnInit} from '@angular/core';
import {AccountService} from './shared/auth/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.identity(true);
  }

}
