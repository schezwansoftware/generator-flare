export class Account {
  constructor(
    public id?: string,
    public authorities?: string[],
    public email?: string,
    public firstName?: string,
    public lastName?: string,
    public login?: string,
    public imageUrl?: string,
  ) {}
}

export class AccountResult {
  constructor(
    public result: Account,
  ) {}
}
