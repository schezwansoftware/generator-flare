import { Injectable } from '@nestjs/common';
import {ChatGroupDTO} from '../../shared/dto/chat-group.DTO';
import {IChatGroup} from './chat-group.interface';
import {SecurityUtils} from '../../auth/security/security.utils';

@Injectable()
export class ChatGroupService {

    async createGroup(chatGroupDTO: ChatGroupDTO): Promise<string> {
        const chatGroup: IChatGroup = {
            groupName: chatGroupDTO.groupName,
            groupAdmins: [SecurityUtils.getCurrentUserLoggedIn().id],
            createdBy: SecurityUtils.getCurrentUserLoggedIn().id,
            createdAt: new Date(),
            members: [SecurityUtils.getCurrentUserLoggedIn().id]
        };
        return '';
    }
}
