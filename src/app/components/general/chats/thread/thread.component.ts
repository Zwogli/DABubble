import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  public currentThreadId!: string;
  public parentChatRecordId!: string;

  public chatRecordId!: string;
  public currentChannel!: Channel;
  public leadingMsg!: Message;
  public leadingMsgId!: string;
  public currentUser!: User;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private fireService: FirestoreService,
    private chatService: ChatService
  ) {
    this.setCurrentUser();
    this.setCurrentChannel();
  }

  ngOnInit(): void {}

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  async setCurrentChannel() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    if (channelId) {
      await this.fireService
        .getSingleDoc('channels', channelId)
        .then((doc: any) => {
          this.currentChannel = doc;
          this.parentChatRecordId = doc.chatRecord;
          console.log(this.parentChatRecordId);
          this.setChatRecordId();
        });
    }
  }

  async setChatRecordId() {
    const msgId = this.route.snapshot.paramMap.get('msgId');
    if (msgId) {
      await this.fireService
        .getSingleSubDoc(this.currentChannel.chatRecord, msgId)
        .then((doc: any) => {
          this.chatRecordId = doc.thread.id;
          this.chatService.setThreadChatRecordId(doc.thread.id);
          this.setLeadingMsg(msgId);
        });
    }
  }

  async setLeadingMsg(msgId: string) {
    this.chatService.chatRecordId = this.chatRecordId;
    console.log(this.chatRecordId);
    if (msgId) {
      await this.chatService.setLeadingMsg(msgId, this.parentChatRecordId);
      console.log(msgId);
    }
    this.leadingMsg = this.chatService.leadingThreadMsg;
  }
}
