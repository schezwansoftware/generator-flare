import {Injectable} from '@nestjs/common';
import {UserDTO} from './user.dto';
<% if (dbType === 'mongodb') {%>import {IUser, User} from './user.interface';
  <%}%><% if (dbType === 'mysql') {%>import {IUser} from './user.interface';
  <%}%>

@Injectable()
export class UserMapper {
  <% if (dbType === 'mongodb') {%>mapUserToUserDTO(user: IUser): UserDTO {
          return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              login: user.login,
              authorities: user.authorities,
              activated: user.activated,
              };
      }

      mapUserDTOToUser(user: UserDTO): IUser {
          return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              password: null,
              login: user.login,
              authorities: user.authorities,
              resetKey: null,
              resetDate: null,
              activated: user.activated,
              activationKey: null,
              };
      }

      mapUserToUserDTOList(users: IUser[]): UserDTO[] {
          const userDTOs: UserDTO[] = [];
          for (const user of users) {
            userDTOs.push(this.mapUserToUserDTO(user));
          }
          return userDTOs;
      }
  <%}%><% if (dbType === 'mysql') {%>mapUserToUserDTO(user: IUser): UserDTO {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            login: user.login,
            authorities: user.authorities.map(x => x.name),
            activated: user.activated,
        };
    }

    mapUserDTOToUser(user: UserDTO): IUser {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: null,
            login: user.login,
            authorities: user.authorities.map(name => ({name})),
            resetKey: null,
            resetDate: null,
        };
    }

    mapUserToUserDTOList(users: IUser[]): UserDTO[] {
        const userDTOs: UserDTO[] = [];
        for (const user of users) {
        userDTOs.push(this.mapUserToUserDTO(user));
        }
        return userDTOs;
    }
<%}%>
}
