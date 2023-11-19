import { Component, Input } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss']
})
export class ChatSubHeaderComponent {
  @Input() type!: 'channel' | 'private' | 'thread';
  @Input() channel!: Channel;
  
  constructor() {}
}
