import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../../shared/auth/account.service';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-password-reset-init',
    templateUrl: './password-reset-init.component.html',
    styleUrls: ['./password-reset-init.component.scss']
})
export class PasswordResetInitComponent implements OnInit {
    emailCtrl = new FormControl();
    success = false;
    error = false;
    message: string;

    constructor(private accountService: AccountService) {
    }

    ngOnInit() {
    }

    submit() {
        this.success = null;
        this.error = null;
        const email = this.emailCtrl.value;
        this.accountService.passwordResetInit(email).subscribe(() => {
            this.success = true;
        }, error => {
            this.error = error.error.message;
        });
    }

}
