import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/models/message.class';
import { Channel } from 'src/app/models/channel.class';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  public msgPayload!: string;
  @Input() currentChannel!: Channel;

  constructor(private fireService: FirestoreService) {}

  sendMessage() {
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(this.currentChannel.chatRecord, data);
    this.msgPayload = '';
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
