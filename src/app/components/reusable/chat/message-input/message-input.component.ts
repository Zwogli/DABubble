import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/models/message.class';
import { chatTypes } from 'src/app/interfaces/chats/types';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  public msgPayload!: string;
  @Input() currentChatId!: string;
  @Input() parentChat!: chatTypes;

  constructor(
    private fireService: FirestoreService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  sendMessage() {
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(this.currentChatId, data);
    this.msgPayload = '';
    this.chatService.updateThreadMetaData();
  }

  setMsgData() {
    const user = this.fireService.currentUser;
    return {
      message: this.msgPayload,
      sentById: user.id,
      sentByName: user.name,
      sentByPhotoUrl: user.photoUrl,
    };
  }
}
