import {Module} from '@nestjs/common';
import {ChatGroupController} from './chat-group.controller';
import {ChatGroupService} from './chat-group.service';
import {ChatGroupRepositroy} from './_repository.ts.ejs';
import {ChatGroupSchema} from './_model.ts.ejs';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'ChatGroup', schema: ChatGroupSchema}]),
    ],
    controllers: [ChatGroupController],
    providers: [ChatGroupService, ChatGroupRepositroy],
    exports: [ChatGroupService],
})
export class ChatGroupModule {
}
