import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AuthServerProvider} from './auth-jwt.service';
import {Observable, Subject} from 'rxjs';
import {Account, AccountResult} from '../model/account.model';

@Injectable({providedIn: 'root'})
export class AccountService {
    private userIdentity: any;
    private authenticated = false;
    private authenticationState = new Subject<any>();

    constructor(private http: HttpClient, private authServerProvider: AuthServerProvider) {
    }

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    register(registerAccount: any) {
        return this.http.post<any>('api/register', registerAccount, {observe: 'response'});
    }

    activate(key: string) {
        return this.http.put<any>(`api/account/activate/${key}`, null, {observe: 'response'});
    }

    login(username: string, password: string, rememberMe: boolean) {
        const data = {username, password, rememberMe};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(data).subscribe(
                res => {
                    this.identity(true).then(account => {
                        resolve(res);
                    });
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    hasAnyAuthority(authorities: string[]): boolean {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }

        for (const authority of authorities) {
            if (this.userIdentity.authorities.includes(authority)) {
                return true;
            }
        }

        return false;
    }

    hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }

        return this.identity().then(
            id => {
                return Promise.resolve(id.authorities && id.authorities.includes(authority));
            },
            () => {
                return Promise.resolve(false);
            }
        );
    }

    getAccount(): Observable<HttpResponse<AccountResult>> {
        return this.http.get<AccountResult>('api/account', {observe: 'response'});
    }

    updateAccount(account: Account): Observable<HttpResponse<AccountResult>> {
        return this.http.put<AccountResult>('api/account', account, {observe: 'response'});
    }

    identity(force?: boolean): Promise<Account> {
        if (force) {
            this.userIdentity = undefined;
        }

        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }
        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.getAccount()
            .toPromise()
            .then(response => {
                const account: Account = response.body.result;
                if (account) {
                    this.userIdentity = account;
                    this.authenticated = true;
                } else {
                    this.userIdentity = null;
                    this.authenticated = false;
                }
                this.authenticationState.next(this.userIdentity);
                return this.userIdentity;
            })
            .catch(() => {
                this.userIdentity = null;
                this.authenticated = false;
                this.authenticationState.next(this.userIdentity);
                return null;
            });
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    logout() {
        this.authServerProvider.logout().subscribe(null, null, () => this.authenticate(null));
    }

    passwordResetInit(email: string) {
      return this.http.post<any>('/api/account/password-reset/init/' + email, null, {observe: 'response'});
    }

    passwordResetFinish(data: any) {
      return this.http.post<any>('/api/account/password-reset/finish/', data, {observe: 'response'});
    }

    changePassword(newPassword: string, oldPassword: string) {
      return this.http.put<any>('/api/account/change-password', {newPassword, oldPassword}, {observe: 'response'});
    }
}
