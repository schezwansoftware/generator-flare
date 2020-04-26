import {Document, Schema} from 'mongoose';

export interface IChatGroup {
    id?: string;
    groupName: string;
    groupAdmins: string[],
    createdBy: string,
    members: string[],
    createdAt: Date

}

export class ChatGroup extends Document implements IChatGroup {
    id: string;
    groupName: string;
    groupAdmins: string[];
    createdAt: Date;
    createdBy: string;
    members: string[];
}
