import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChatService } from 'src/app/services/chat.service';
import { chatTypes } from 'src/app/interfaces/chats/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss'],
})
export class ChatSubHeaderComponent {
  @Input() type!: chatTypes;
  @Input() channel!: Channel;
  public mainType: string;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    const channelId: string =
      this.route.snapshot.paramMap.get('type')!;
    this.mainType = channelId;
    console.log(this.mainType);
  }

  navigateBack() {
    this.chatService.navigateBack('thread');
  }
}
