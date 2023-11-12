import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss', '../../../../style/chat.scss'],
})
export class ThreadComponent implements OnInit {
  public currentThreadId!: string;
  public chatRecord!: Message[];
  public currentChannel!: Channel;
  public leadingMsg!: Message;

  constructor(
    private route: ActivatedRoute,
    private fireService: FirestoreService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.leadingMsg = this.chatService.leadingThreadMsg;
    this.setCurrentChannel();
  }

  async setCurrentChannel() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    if (channelId) {
      await this.fireService
        .getSingleDoc('channels', channelId)
        .then((doc: any) => {
          this.currentChannel = doc;
        });
    }
  }
}
