import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from './account.service';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlareRouteGuard implements CanActivate {

    constructor(private accountService: AccountService, private route: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const data = route.data;
        if (data && data.authorities && data.authorities.length > 0) {
            return this.checkLogin(data.authorities, state.url);
        }
        return true;
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        return this.accountService.identity().then(account => {
            if (account) {
                const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities);
                if (hasAnyAuthority) {
                    return true;
                }
                this.route.navigate(['accessdenied']);
                return false;
            }
            this.route.navigate(['login']);
            return false;
        });
    }
}
