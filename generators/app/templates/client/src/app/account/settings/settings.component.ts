import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../shared/auth/account.service';
import {Account} from '../../shared/model/account.model';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    settingsForm = this.fb.group({
        firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
        activated: [false],
        authorities: [[]],
        login: [],
    });
    account: Account;

    constructor(private fb: FormBuilder, private accountService: AccountService) {
    }

    ngOnInit() {
        this.accountService.getAccount().subscribe(res => {
            this.account = res.body.result;
            this.createForm(this.account);
        });
    }

    private createForm(account: Account) {
        this.settingsForm.patchValue({
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            authorities: account.authorities,
            imageUrl: account.imageUrl
        });
    }

    save() {
        this.success = null;
        this.error = null;
        this.account.firstName = this.settingsForm.get('firstName').value;
        this.account.lastName = this.settingsForm.get('lastName').value;
        this.account.email = this.settingsForm.get('email').value;
        this.accountService.updateAccount(this.account).subscribe(res => {
           this.account = res.body.result;
           this.success = 'OK';
        }, error => {
            this.error = error.error.message;
        });
    }
}
