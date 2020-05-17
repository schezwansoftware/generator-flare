import {IUser} from '../../user/user.interface';

export class SecurityUtils {
    private static user: IUser;
    private static authoirities: string[];

    static setCurrentUser(user: IUser): void {
        this.user = user;
<% if (dbType === 'mongodb') {-%>
       this.authoirities = user.authorities;
<%}-%><% if (dbType === 'mysql') {-%>
       this.authoirities = user.authorities.map(x => x.name);
<%}-%>
    }

    static getCurrentUserLoggedIn(): IUser {
        return this.user;
    }

    static isCurrentUserInRole(authority: string): boolean {
        return this.authoirities.filter(x => x === authority).length > 0;
    }

    static hasAnyAuthority(authority: string | string[]): boolean {
        const authorities = typeof authority === 'string' ? [authority] : authority;
        for (const value of authorities) {
            if (this.authoirities.filter(x => x === value).length > 0) { return true; }
        }
        return false;
    }
}
