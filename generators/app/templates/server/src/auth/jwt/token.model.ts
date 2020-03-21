export class JWTToken {
    expiresIn: number;
    accessToken: string;

    constructor(expiresIn: number, accessToken: string) {
        this.expiresIn = expiresIn;
        this.accessToken = accessToken;
    }
}
