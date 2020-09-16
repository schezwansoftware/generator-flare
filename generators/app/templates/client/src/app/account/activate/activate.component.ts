import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../shared/auth/account.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  key: string;
  success: boolean;
  error: boolean;
  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.key = params.key;
      this.accountService.activate(this.key).subscribe(() => {
        this.success = true;
      }, () => {
        this.error = true;
      });
    });
  }

}
