import {Entity, PrimaryColumn} from 'typeorm';
import {MaxLength} from 'class-validator';

@Entity()
export class Authority {
    @PrimaryColumn({default: 'ROLE_USER'})
    @MaxLength(50)
    name: string;
}
