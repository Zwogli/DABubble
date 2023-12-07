import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChatService } from 'src/app/services/chat.service';
import { chatTypes } from 'src/app/interfaces/chats/types';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss'],
})
export class ChatSubHeaderComponent {
  @Input() type!: chatTypes;
  @Input() channel!: Channel;

  constructor(private chatService: ChatService) {}

  navigateBack() {
    this.chatService.navigateBack('thread');
  }
}
