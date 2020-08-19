import {IUser} from '../../user/user.interface';
import * as contextService from 'request-context';

export class SecurityUtils {

    static getCurrentUserLoggedIn(): IUser {
        return contextService.get('request:user');
    }

    static isCurrentUserInRole(authority: string): boolean {
        let authorities: string[] = [];
        const user = contextService.get('request:user');
        if (user && user.authorities) {
            <% if (dbType === 'mongodb') {-%>
                authorities = user.authorities;
         <%}-%><% if (dbType === 'mysql') {-%>
            authorities = user.authorities.map(x => x.name);
         <%}-%>
        }
        return authorities.filter(x => x === authority).length > 0;
    }

    static hasAnyAuthority(authority: string | string[]): boolean {
        let authorities: string[] = [];
        const user = contextService.get('request:user');
        if (user && user.authorities) {
            <% if (dbType === 'mongodb') {-%>
                authorities = user.authorities;
         <%}-%><% if (dbType === 'mysql') {-%>
            authorities = user.authorities.map(x => x.name);
         <%}-%>
        }
        const userAuthorities = typeof authority === 'string' ? [authority] : authority;
        for (const value of userAuthorities) {
            if (authorities.filter(x => x === value).length > 0) {
                return true;
            }
        }
        return false;
    }
}
