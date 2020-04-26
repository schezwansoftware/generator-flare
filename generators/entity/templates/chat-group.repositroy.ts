import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ChatGroup, IChatGroup} from './_interface.ts.ejs';

@Injectable()
export class ChatGroupRepositroy {
    constructor(@InjectModel('ChatGroup') private readonly chatGroupModel: Model<ChatGroup>) { }

    async save(chatGroup: IChatGroup): Promise<IChatGroup> {
        const newChatGroup = new this.chatGroupModel(chatGroup);
        return newChatGroup.save();
    }

    async update(chatGroup: IChatGroup): Promise<IChatGroup> {
        return await this.chatGroupModel.findByIdAndUpdate(chatGroup.id, chatGroup , {new: true});
    }

    async findAll(): Promise<IChatGroup[]> {
        return await this.chatGroupModel.find();
    }

    async findById(id: string): Promise<IChatGroup> {
        return await this.chatGroupModel.findById(id);
    }

    async deleteById(id: string): Promise<void> {
        await this.chatGroupModel.findByIdAndDelete(id);
    }
}
